import config from 'config'
import {getBoardInfo, getIssueEvents, getReposForBoard} from '../../fetchers/zenHub'
import {getIssuesForRepo, getRepo} from '../../fetchers/gitHub'
import {getAnalysis, saveEvent} from '../../fetchers/keen'
import {composeIssue} from './issueUtil'
import {cycleTimeForIssue, leadTimeForIssue, wip} from './kanban'

/* eslint-disable no-console, camelcase */
export async function computeWip(reposToCompute, since) {
  const promises = reposToCompute.map(repoName => _computeWipForBoard(repoName, since))
  const wips = await Promise.all(promises)
  return wips.map((wip, i) => ({
    boardRepoName: reposToCompute[i],
    result: wip
  }))
}

export function fetchAverage(targetProperty, groupBy, end) {
  const eventCollection = 'issues'
  let timeframe = 'this_30_days'
  if (end) {
    const start = new Date(end)
    start.setUTCDate(start.getUTCDate() - 30)
    timeframe = {start, end}
  }
  const options = {
    eventCollection,
    timeframe,
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

export function fetchThroughput(groupBy) {
  const eventCollection = 'issues'
  const timeframe = 'this_7_days'
  const options = {
    eventCollection,
    timeframe,
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

export async function saveMetricsForIssues(boardRepoName, since) {
  const repo = await getRepo(boardRepoName)
  const repos = await getReposForBoard(repo.id)
  const reposBoardInfos = await _getBoardInfoForRepos(repos.repos)

  const newIssuesLane = config.get('flow.metrics')[boardRepoName].get('newIssuesLane')
  const cycleTimeStartLane = config.get('flow.metrics')[boardRepoName].get('cycleTime.startLane')
  const leadTimeStartLane = config.get('flow.metrics')[boardRepoName].get('leadTime.startLane')
  const closedGHIssuesByRepoId = await _getIssueDataByRepoIdSince(repos.repos, since, 'closed')
  const noPRs = issue => !issue.pull_request
  const composedIssues = await _getFlattenedFilteredComposedIssues(newIssuesLane, repos.repos, closedGHIssuesByRepoId, noPRs)

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

/**
 * helpers
 */

function _getBoardInfoForRepos(repos) {
  const promises = repos.map(repo => getBoardInfo(repo.repo_id))
  return Promise.all(promises)
}

function _issueDataForGitHubIssue(repo) {
  return async ghIssue => {
    const zhIssueEvents = await getIssueEvents(repo, ghIssue)
    return {repo, ghIssue, zhIssueEvents}
  }
}

async function _getIssueDataByRepoIdSince(repos, since, state = 'all') {
  const promises = repos.map(repo => getIssuesForRepo(repo.cached_repo_name, {state, since: since.toISOString()}))
  const perRepoIssues = await Promise.all(promises)
  return perRepoIssues.reduce((curr, issues, i) => {
    const {repo_id} = repos[i]
    curr.set(repo_id, issues)
    return curr
  }, new Map())
}

async function _getFlattenedFilteredComposedIssues(newIssuesLane, repos, ghIssuesByRepoId, filter = null) {
  let issueDataPromises = []
  ghIssuesByRepoId.forEach((unfilteredIssues, repoId) => {
    const repo = repos.find(repo => repo.repo_id === repoId)
    const issues = filter ? unfilteredIssues.filter(filter) : unfilteredIssues
    const repoIssueDataPromises = issues.map(_issueDataForGitHubIssue(repo))
    issueDataPromises = issueDataPromises.concat(repoIssueDataPromises)
  })
  const issueDatas = await Promise.all(issueDataPromises)
  return issueDatas.map(({repo, ghIssue, zhIssueEvents}) => (
    composeIssue(newIssuesLane, repo, ghIssue, zhIssueEvents)
  ))
}

function _computeWipForAllRepos(wipLaneNames, repos, reposBoardInfos, ghIssuesByRepoId) {
  return reposBoardInfos
    .reduce((curr, boardInfo, i) => {
      const repo = repos[i]
      const prIssueNumbers = [...ghIssuesByRepoId.get(repo.repo_id)]
        .filter(issue => Boolean(issue.pull_request))
        .map(issue => issue.number)
      return curr + wip(wipLaneNames, boardInfo, prIssueNumbers)
    }, 0)
}

async function _computeWipForBoard(repoName, since) {
  const repo = await getRepo(repoName)
  const repos = await getReposForBoard(repo.id)
  const reposBoardInfos = await _getBoardInfoForRepos(repos.repos)
  const ghIssuesByRepoId = await _getIssueDataByRepoIdSince(repos.repos, since)
  const wipLaneNames = config.get('flow.metrics')[repoName].get('wip.lanes')

  return _computeWipForAllRepos(wipLaneNames, repos.repos, reposBoardInfos, ghIssuesByRepoId)
}
