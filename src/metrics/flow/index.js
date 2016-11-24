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
async function computeMetricsForBoard(repoName, since) {
  try {
    const repo = await getRepo(repoName)
    const repos = await getReposForBoard(repo.id)
    const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
    const ghIssuesByRepoId = await getIssueDataByRepoIdSince(repos.repos, since)
    const newIssuesLane = config.get('flow.metrics')[repoName].get('newIssuesLane')
    const closedNonPRFilter = issue => Boolean(issue.closed_at) && !issue.pull_request
    const composedIssues = await getFlattenedFilteredComposedIssues(newIssuesLane, repos.repos, ghIssuesByRepoId, closedNonPRFilter)

    const cycleTimeStartLane = config.get('flow.metrics')[repoName].get('cycleTime.startLane')
    const issueCycleTimes = composedIssues
      .map(composedIssue => {
        const boardInfoIdx = repos.repos.findIndex(repo => repo.repo_id === composedIssue.repoId)
        return cycleTimeForIssue(cycleTimeStartLane, composedIssue, reposBoardInfos[boardInfoIdx])
      })
      .filter(num => num > 0)

    const leadTimeStartLane = config.get('flow.metrics')[repoName].get('leadTime.startLane')
    const issueLeadTimes = composedIssues
      .map(composedIssue => {
        const boardInfoIdx = repos.repos.findIndex(repo => repo.repo_id === composedIssue.repoId)
        return leadTimeForIssue(leadTimeStartLane, composedIssue, reposBoardInfos[boardInfoIdx])
      })
      .filter(num => num > 0)

    const wipLaneNames = config.get('flow.metrics')[repoName].get('wip.lanes')
    return {
      project: repoName,
      cycleTime: mean(issueCycleTimes),
      leadTime: mean(issueLeadTimes),
      throughput: composedIssues.length,
      wip: computeWipForAllRepos(wipLaneNames, repos.repos, reposBoardInfos, ghIssuesByRepoId),
    }
  } catch (err) {
    throw err
  }
}

async function displayMetrics(since) {
  try {
    const reposToCompute = config.get('flow.repos')
    const promises = reposToCompute.map(repoName => computeMetricsForBoard(repoName, since))
    const projects = await Promise.all(promises)
    console.info(table(projects, {includeHeaders: true}))
  } catch (err) {
    throw err
  }
}

async function saveMetricsForIssues(boardRepoName, since) {
  const repo = await getRepo(boardRepoName)
  const repos = await getReposForBoard(repo.id)
  const reposBoardInfos = await getBoardInfoForRepos(repos.repos)

  const newIssuesLane = config.get('flow.metrics')[boardRepoName].get('newIssuesLane')
  const cycleTimeStartLane = config.get('flow.metrics')[boardRepoName].get('cycleTime.startLane')
  const leadTimeStartLane = config.get('flow.metrics')[boardRepoName].get('leadTime.startLane')
  const closedGHIssuesByRepoId = await getIssueDataByRepoIdSince(repos.repos, since, 'closed')
  const composedIssues = await getFlattenedFilteredComposedIssues(newIssuesLane, repos.repos, closedGHIssuesByRepoId)

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
        keen: {timestamp: composedIssue.closedAt},
      }
    })

  const saveIssuePromises = issuesWithMetrics.map(issue => saveEvent('flow', 'issues', issue))
  return Promise.all(saveIssuePromises)
}

async function saveMetrics() {
  try {
    const defaultSince = new Date()
    defaultSince.setDate(defaultSince.getDate() - 7)
    const reposToCompute = config.get('flow.repos')
    const lastIssue = (await getAnalysis('flow', 'extraction', {
      eventCollection: 'issues',
      timeframe: 'this_10_years',
      latest: 1,
    })).result[0]
    const since = lastIssue ? new Date(lastIssue.keen.timestamp) : defaultSince
    const promises = reposToCompute.map(repoName => saveMetricsForIssues(repoName, since))
    await Promise.all(promises)
  } catch (err) {
    throw err
  }
}

function logErrorAndExit(err) {
  console.error(err)
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
