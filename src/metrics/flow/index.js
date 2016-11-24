import config from 'config'

import {table} from '../../util/presenters'
import {getAnalysis, saveEvent} from '../../fetchers/keen'
import logErrorAndExit from '../../util/logErrorAndExit'
import {
  computeWip,
  fetchAverage,
  fetchThroughput,
  saveMetricsForIssues,
} from './boardUtil'

/* eslint-disable no-console */
async function getProjectsMetrics(end = new Date()) {
  const reposToCompute = config.get('flow.repos')
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const wips = await computeWip(reposToCompute, since)
  const {result: cycleTimes} = (await fetchAverage('cycleTime', 'boardRepoName', end)) || {result: []}
  const {result: leadTimes} = (await fetchAverage('leadTime', 'boardRepoName', end)) || {result: []}
  const {result: throughputs} = (await fetchThroughput('boardRepoName')) || {result: []}

  const projects = reposToCompute.map(repoName => {
    const {result: cycleTime} = cycleTimes.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: leadTime} = leadTimes.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: throughput} = throughputs.find(_ => _.boardRepoName === repoName) || {result: undefined}
    const {result: wip} = wips.find(_ => _.boardRepoName === repoName)
    return {
      project: repoName,
      cycleTime,
      leadTime,
      throughput,
      wip,
      _tsMillis: end.getTime(),
      keen: {timestamp: end}
    }
  })

  return projects
}

function saveRollupMetrics(projects) {
  const promises = projects.map(project => saveEvent('flow', 'issuesRollups', project))
  return Promise.all(promises)
}

async function saveIssueMetrics() {
  const defaultSince = new Date()
  defaultSince.setUTCDate(defaultSince.getUTCDate() - 14)
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

async function run() {
  try {
    // save metrics for any newly-closed issues
    await saveIssueMetrics()

    // save and display roll-up metrics
    const projects = await getProjectsMetrics()
    await saveRollupMetrics(projects)
    console.info(table(projects, {includeHeaders: true}))
  } catch (err) {
    logErrorAndExit(err)
  }
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  run().then(() => process.exit(0))
}
