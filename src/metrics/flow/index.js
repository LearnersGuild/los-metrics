/* eslint-disable no-console, camelcase */
import config from 'config'

import {table} from '../../util/presenters'
import {mean} from '../../util/math'
import {
  getReposForBoard,
  getBoardInfo,
  getIssueEvents,
} from '../../fetchers/zenHub'
import {
  getRepo,
  getIssuesForRepo,
} from '../../fetchers/gitHub'
import {
  composeIssue,
} from './issueUtil'
import {
  wip as computeWip,
  cycleTimeForIssue,
  leadTimeForIssue,
} from './kanban'

function getBoardInfoForRepos(repos) {
  const promises = repos.map(repo => getBoardInfo(repo.repo_id))
  return Promise.all(promises)
}

function issueDataForGitHubIssue(repo) {
  return async ghIssue => {
    try {
      const zhIssueEvents = await getIssueEvents(repo, ghIssue)
      return {repo, ghIssue, zhIssueEvents}
    } catch (err) {
      throw err
    }
  }
}

async function getIssueDataByRepoIdSince(repos, since) {
  try {
    const promises = repos.map(repo => getIssuesForRepo(repo.cached_repo_name, {state: 'all', since: since.toISOString()}))
    const perRepoIssues = await Promise.all(promises)
    return perRepoIssues.reduce((curr, issues, i) => {
      const {repo_id} = repos[i]
      curr.set(repo_id, issues)
      return curr
    }, new Map())
  } catch (err) {
    throw err
  }
}

async function getClosedComposedNonPRIssues(newIssuesLane, repos, ghIssuesByRepoId) {
  try {
    let issueDataPromises = []
    ghIssuesByRepoId.forEach((issues, repoId) => {
      const repo = repos.find(repo => repo.repo_id === repoId)
      const closedNonPRIssues = issues
        .filter(issue => Boolean(issue.closed_at) && !issue.pull_request)
      const repoIssueDataPromises = closedNonPRIssues
        .map(issueDataForGitHubIssue(repo))
      issueDataPromises = issueDataPromises.concat(repoIssueDataPromises)
    })
    const issueDatas = await Promise.all(issueDataPromises)
    return issueDatas.map(({repo, ghIssue, zhIssueEvents}) => (
      composeIssue(newIssuesLane, repo, ghIssue, zhIssueEvents)
    ))
  } catch (err) {
    throw err
  }
}

function computeWipForAllRepos(wipLaneNames, repos, reposBoardInfos, ghIssuesByRepoId) {
  return reposBoardInfos
    .reduce((curr, boardInfo, i) => {
      const repo = repos[i]
      const prIssueNumbers = [...ghIssuesByRepoId.get(repo.repo_id)]
        .filter(issue => Boolean(issue.pull_request))
        .map(issue => issue.number)
      return curr + computeWip(wipLaneNames, boardInfo, prIssueNumbers)
    }, 0)
}

async function computeMetricsForBoard(repoName, since) {
  try {
    const repo = await getRepo(repoName)
    const repos = await getReposForBoard(repo.id)
    const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
    const ghIssuesByRepoId = await getIssueDataByRepoIdSince(repos.repos, since)
    const newIssuesLane = config.get('flow.metrics')[repoName].get('newIssuesLane')
    const composedIssues = await getClosedComposedNonPRIssues(newIssuesLane, repos.repos, ghIssuesByRepoId)

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

export default computeMetricsForBoard

if (!module.parent) {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  displayMetrics(since)
    .catch(err => {
      console.error(err)
      /* eslint-disable xo/no-process-exit */
      process.exit(1)
    })
}
