import config from 'config'

import {table} from '../../util/presenters'
import {getAnalysis} from '../../fetchers/keen'
import {
  computeWip,
  fetchAverage,
  fetchThroughput,
  saveMetricsForIssues,
} from './boardUtil'

/* eslint-disable no-console, camelcase */
async function displayMetrics(since) {
  const reposToCompute = config.get('flow.repos')
  const wips = await computeWip(reposToCompute, since)
  const {result: cycleTimes} = (await fetchAverage('cycleTime', 'boardRepoName')) || {result: []}
  const {result: leadTimes} = (await fetchAverage('leadTime', 'boardRepoName')) || {result: []}
  const {result: throughputs} = (await fetchThroughput('boardRepoName')) || {result: []}

  const projects = reposToCompute.map(repoName => {
    const {result: cycleTime} = cycleTimes.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: leadTime} = leadTimes.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: throughput} = throughputs.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: wip} = wips.find(_ => _.boardRepoName === repoName)
    return {project: repoName, cycleTime, leadTime, throughput, wip}
  })

  console.info(table(projects, {includeHeaders: true}))
}

async function saveMetrics() {
  const defaultSince = new Date()
  defaultSince.setDate(defaultSince.getDate() - 14)
  const reposToCompute = config.get('flow.repos')
  const {result: maxTS} = await getAnalysis('flow', 'maximum', {
    eventCollection: 'issues',
    targetProperty: '_tsMillis',
    timeframe: 'this_10_years',
  })
  const since = maxTS ? new Date(maxTS) : defaultSince
  since.setUTCSeconds(since.getUTCSeconds() + 1) // add 1s to avoid getting the last issue we wrote
  const promises = reposToCompute.map(repoName => saveMetricsForIssues(repoName, since))
  await Promise.all(promises)
}

function logErrorAndExit(err) {
  console.error(err.stack)
  /* eslint-disable xo/no-process-exit */
  process.exit(1)
}

async function run() {
  try {
    // display the past week's metrics
    const displaySince = new Date()
    displaySince.setDate(displaySince.getDate() - 7)
    await displayMetrics(displaySince)

    // save metrics for any newly-closed issues
    await saveMetrics()
  } catch (err) {
    logErrorAndExit(err)
  }
}

if (!module.parent) {
  run().then(() => process.exit(0))
}
