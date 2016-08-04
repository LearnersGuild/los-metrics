/* eslint-disable no-console, camelcase */
import config from 'config'

import {table} from '../../util/presenters'
import {
  getReposForBoard,
  getBoardInfo,
  getIssueEvents,
} from '../../fetchers/zenHub'
import {
  getRepo,
  getClosedIssuesForRepoSince,
} from '../../fetchers/gitHub'

const ISSUES_CLOSED_SINCE_DATE = new Date()
ISSUES_CLOSED_SINCE_DATE.setDate(ISSUES_CLOSED_SINCE_DATE.getDate() - 7)

function getBoardInfoForRepos(repos) {
  const promises = repos.map(repo => getBoardInfo(repo.repo_id))
  return Promise.all(promises)
}

function getIssuesForRepos(repos) {
  const promises = repos.map(repo => getClosedIssuesForRepoSince(repo.cached_repo_name, ISSUES_CLOSED_SINCE_DATE))
  return Promise.all(promises)
}

function getIssuesEvents(issues) {
  const promises = issues.map(issue => getIssueEvents(issue))
  return Promise.all(promises)
}

function zipReposIssues(repos, reposIssues) {
  return repos.reduce((issues, repo, i) => {
    const repoIssues = reposIssues[i]
    const repoIssuesData = repoIssues.map(issue => {
      return {
        repo_id: repo.repo_id,
        repo_name: repo.cached_repo_name,
        id: issue.id,
        number: issue.number,
        created_at: issue.created_at,
        closed_at: issue.closed_at,
      }
    })
    return issues.concat(repoIssuesData)
  }, [])
}

function getIssuesMetrics(issuesWithEvents) {
  return issuesWithEvents.map(issue => {
    const issueTransfers = issue.events.filter(event => event.type === 'transferIssue')
    const inProgressTransfers = issueTransfers.filter(xfer => xfer.to_pipeline.name === 'In Progress')
    const lastInProgressTransfer = inProgressTransfers[inProgressTransfers.length - 1]
    // if it was never moved to 'In Progress', someone forgot to move it, so
    // we'll just compute from when it was created
    const lastInProgressAt = lastInProgressTransfer ? lastInProgressTransfer.created_at : issue.created_at
    const whenCreated = new Date(issue.created_at).getTime()
    const whenInProgress = new Date(lastInProgressAt).getTime()
    const whenClosed = new Date(issue.closed_at).getTime()
    return Object.assign({}, issue, {
      in_progress_at: lastInProgressAt,
      cycleTime: Math.round((whenClosed - whenInProgress) / 1000),
      leadTime: Math.round((whenClosed - whenCreated) / 1000),
    })
  })
}

const PIPELINES_NOT_IN_WIP = ['New Issues', 'Backlog', 'To Do', 'Done']

async function computeMetricsForRepo(repoName) {
  try {
    const repo = await getRepo(repoName)
    const repos = await getReposForBoard(repo.id)

    // compute wip
    const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
    const wip = reposBoardInfos.reduce((wipSum, boardInfo) => {
      const boardSum = boardInfo.pipelines.reduce((boardWipSum, pipeline) => {
        return PIPELINES_NOT_IN_WIP.includes(pipeline.name) ? boardWipSum : boardWipSum + pipeline.issues.length
      }, 0)
      return wipSum + boardSum
    }, 0)

    // compute throughput, leadTime, and cycleTime
    const reposIssues = await getIssuesForRepos(repos.repos)
    const issues = zipReposIssues(repos.repos, reposIssues)
    const issuesEvents = await getIssuesEvents(issues)
    const issuesWithEvents = issues.map((issue, i) => Object.assign({}, issue, {events: issuesEvents[i]}))
    const issuesWithMetrics = getIssuesMetrics(issuesWithEvents)
    const leadTimeSeconds = issuesWithMetrics.reduce((sum, issue) => {
      return sum + issue.leadTime
    }, 0) / issuesWithMetrics.length
    const cycleTimeSeconds = issuesWithMetrics.reduce((sum, issue) => {
      return sum + issue.cycleTime
    }, 0) / issuesWithMetrics.length
    const secondsInDay = 60 * 60 * 24
    const leadTime = Math.round(leadTimeSeconds / secondsInDay * 10) / 10
    const cycleTime = Math.round(cycleTimeSeconds / secondsInDay * 10) / 10

    return {
      repo: repoName,
      leadTime,
      cycleTime,
      wip,
      throughput: issuesWithMetrics.length,
    }
  } catch (err) {
    throw err
  }
}

async function computeMetrics() {
  try {
    const reposToCompute = config.get('flow.repos')
    const promises = reposToCompute.map(repoName => computeMetricsForRepo(repoName))
    const projects = await Promise.all(promises)
    console.log(table(projects, {includeHeaders: true}))
  } catch (err) {
    throw err
  }
}

export default computeMetrics

if (!module.parent) {
  computeMetrics()
}
