import config from 'config'

import {table} from '../../util/presenters'
import {mean} from '../../util/math'
import {getReposForBoard} from '../../fetchers/zenHub'
import {getAnalysis, saveEvent} from '../../fetchers/keen'
import {getRepo} from '../../fetchers/gitHub'
import {cycleTimeForIssue, leadTimeForIssue} from './kanban'
import {
  getBoardInfoForRepos,
  getIssueDataByRepoIdSince,
  getFlattenedFilteredComposedIssues,
  computeWipForAllRepos,
} from './boardUtil'

/* eslint-disable no-console, camelcase */
async function computeWipForBoard(repoName, since) {
  const repo = await getRepo(repoName)
  const repos = await getReposForBoard(repo.id)
  const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
  const ghIssuesByRepoId = await getIssueDataByRepoIdSince(repos.repos, since)
  const wipLaneNames = config.get('flow.metrics')[repoName].get('wip.lanes')

  return computeWipForAllRepos(wipLaneNames, repos.repos, reposBoardInfos, ghIssuesByRepoId)
}

async function computeWip(reposToCompute, since) {
  const promises = reposToCompute.map(repoName => computeWipForBoard(repoName, since))
  const wips = await Promise.all(promises)
  return wips.map((wip, i) => ({
    boardRepoName: reposToCompute[i],
    result: wip
  }))
}

async function fetchAverage(targetProperty, groupBy) {
  const options = {
    eventCollection: 'issues',
    timeframe: 'this_1_month',
    targetProperty,
    groupBy,
    filters: [{
      propertyName: targetProperty,
      operator: 'gt',
      propertyValue: 0,
    }, {
      propertyName: groupBy,
      operator: 'exists',
      propertyValue: true,
    }],
  }

  return getAnalysis('flow', 'average', options)
}

async function fetchThroughput(groupBy) {
  const options = {
    eventCollection: 'issues',
    timeframe: 'this_7_days',
    groupBy,
    filters: [{
      propertyName: 'cycleTime',
      operator: 'gt',
      propertyValue: 0,
    }, {
      propertyName: 'leadTime',
      operator: 'gt',
      propertyValue: 0,
    }, {
      propertyName: groupBy,
      operator: 'exists',
      propertyValue: true,
    }],
  }

  return getAnalysis('flow', 'count', options)
}

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

async function saveMetricsForIssues(boardRepoName, since) {
  const repo = await getRepo(boardRepoName)
  const repos = await getReposForBoard(repo.id)
  const reposBoardInfos = await getBoardInfoForRepos(repos.repos)

  const newIssuesLane = config.get('flow.metrics')[boardRepoName].get('newIssuesLane')
  const cycleTimeStartLane = config.get('flow.metrics')[boardRepoName].get('cycleTime.startLane')
  const leadTimeStartLane = config.get('flow.metrics')[boardRepoName].get('leadTime.startLane')
  const closedGHIssuesByRepoId = await getIssueDataByRepoIdSince(repos.repos, since, 'closed')
  const noPRs = issue => !issue.pull_request
  const composedIssues = await getFlattenedFilteredComposedIssues(newIssuesLane, repos.repos, closedGHIssuesByRepoId, noPRs)

  const issuesWithMetrics = composedIssues
    .map(composedIssue => {
      const boardInfoIdx = repos.repos.findIndex(repo => repo.repo_id === composedIssue.repoId)
      const cycleTime = cycleTimeForIssue(cycleTimeStartLane, composedIssue, reposBoardInfos[boardInfoIdx])
      const leadTime = leadTimeForIssue(leadTimeStartLane, composedIssue, reposBoardInfos[boardInfoIdx])
      return {
        ...composedIssue,
        boardRepoName,
        cycleTime,
        leadTime,
        _tsMillis: (new Date(composedIssue.updatedAt)).getTime(),
        keen: {timestamp: composedIssue.updatedAt},
      }
    })

  const saveIssuePromises = issuesWithMetrics.map(issue => saveEvent('flow', 'issues', issue))
  return Promise.all(saveIssuePromises)
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
