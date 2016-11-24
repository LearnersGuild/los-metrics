import config from 'config'

import {table} from '../../util/presenters'
import {getAnalysis, saveEvent} from '../../fetchers/keen'
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

function logErrorAndExit(err) {
  console.error(err.stack)
  /* eslint-disable xo/no-process-exit */
  process.exit(1)
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
  run().then(() => process.exit(0))
}

async function _backfillRollupMetrics() {
  const toMerge = {
    'game-prototype': [
      {throughput: 6, wip: 7},
      {throughput: 6, wip: 7},
      {throughput: 6, wip: 7},
      {throughput: 6, wip: 7},
      {throughput: 6, wip: 7},
      {throughput: 4, wip: 6},
      {throughput: 4, wip: 6},
      {throughput: 4, wip: 6},
      {throughput: 4, wip: 6},
      {throughput: 4, wip: 6},
      {throughput: 5, wip: 5},
      {throughput: 5, wip: 5},
      {throughput: 5, wip: 5},
      {throughput: 5, wip: 5},
      {throughput: 5, wip: 5},
      {throughput: 2, wip: 10},
      {throughput: 2, wip: 10},
      {throughput: 2, wip: 10},
      {throughput: 2, wip: 10},
      {throughput: 2, wip: 10},
      {throughput: 2, wip: 10},
    ],
    'game': [
      {throughput: 10, wip: 7},
      {throughput: 10, wip: 7},
      {throughput: 10, wip: 7},
      {throughput: 10, wip: 7},
      {throughput: 10, wip: 7},
      {throughput: 19, wip: 6},
      {throughput: 19, wip: 6},
      {throughput: 19, wip: 6},
      {throughput: 19, wip: 6},
      {throughput: 19, wip: 6},
      {throughput: 8, wip: 12},
      {throughput: 8, wip: 12},
      {throughput: 8, wip: 12},
      {throughput: 8, wip: 12},
      {throughput: 8, wip: 12},
      {throughput: 3, wip: 5},
      {throughput: 3, wip: 5},
      {throughput: 3, wip: 5},
      {throughput: 3, wip: 5},
      {throughput: 3, wip: 5},
      {throughput: 3, wip: 5},
    ]
  }
  const numDays = toMerge.game.length
  const start = new Date()
  start.setUTCDate(start.getUTCDate() - numDays)
  const promises = Array.from(Array(numDays).keys()).map(i => {
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + i)
    return getProjectsMetrics(end)
  })
  const dailyProjectsMetrics = await Promise.all(promises)
  const fullDailyProjectsMetrics = dailyProjectsMetrics.map((dm, i) => {
    return dm.map(proj => ({...proj, ...toMerge[proj.project][i]}))
  })
  const flattenedMetrics = fullDailyProjectsMetrics.reduce((result, dm) => {
    result = result.concat(dm)
    return result
  }, [])

  await saveRollupMetrics(flattenedMetrics)
}
