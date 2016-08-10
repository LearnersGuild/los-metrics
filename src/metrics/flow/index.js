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
  getClosedIssuesForRepoSince,
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

async function getIssueDataForRepoSince(repo, since) {
  try {
    const ghIssues = await getClosedIssuesForRepoSince(repo.cached_repo_name, since)
    const issueDataPromises = ghIssues.map(issueDataForGitHubIssue(repo))
    return Promise.all(issueDataPromises)
  } catch (err) {
    throw err
  }
}

async function getComposedIssuesForReposSince(repos, since) {
  try {
    const promises = repos.map(repo => getIssueDataForRepoSince(repo, since))
    const perRepoIssueDatas = await Promise.all(promises)
    return perRepoIssueDatas
      .reduce((curr, issueDatas) => curr.concat(issueDatas), [])
      .map(issueData => {
        const {repo, ghIssue, zhIssueEvents} = issueData
        return composeIssue(repo, ghIssue, zhIssueEvents)
      })
  } catch (err) {
    throw err
  }
}

function computeWipForAllRepos(reposBoardInfos) {
  return reposBoardInfos
    .reduce((curr, boardInfo) => {
      return curr + computeWip(boardInfo)
    }, 0)
}

async function computeMetricsForBoard(repoName, since) {
  try {
    const repo = await getRepo(repoName)
    const repos = await getReposForBoard(repo.id)
    const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
    const composedIssues = await getComposedIssuesForReposSince(repos.repos, since)
    const issueCycleTimes = composedIssues
      .map(composedIssue => {
        const boardInfoIdx = repos.repos.findIndex(repo => repo.repo_id === composedIssue.repoId)
        return cycleTimeForIssue(composedIssue, reposBoardInfos[boardInfoIdx])
      })
      .filter(num => num > 0)
    const issueLeadTimes = composedIssues
      .map(composedIssue => {
        const boardInfoIdx = repos.repos.findIndex(repo => repo.repo_id === composedIssue.repoId)
        return leadTimeForIssue(composedIssue, reposBoardInfos[boardInfoIdx])
      })
      .filter(num => num > 0)
    return {
      project: repoName,
      cycleTime: mean(issueCycleTimes),
      leadTime: mean(issueLeadTimes),
      throughput: composedIssues.length,
      wip: computeWipForAllRepos(reposBoardInfos),
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
    console.log(table(projects, {includeHeaders: true}))
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
