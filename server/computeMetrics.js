/* eslint-disable no-console, camelcase */
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import {
  getReposForBoard,
  getBoardInfo,
  getIssueEvents,
} from '../common/fetchers/zenHub'

import {
  getRepo,
  getClosedIssuesForRepoSince,
} from '../common/fetchers/gitHub'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

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
  let issues = []
  for (const i in repos) {
    if (repos.hasOwnProperty(i)) {
      const repo = repos[i]
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
      issues = issues.concat(repoIssuesData)
    }
  }
  return issues
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
    console.log(`Computing wip for ${repoName} ...`)
    const reposBoardInfos = await getBoardInfoForRepos(repos.repos)
    const wip = reposBoardInfos.reduce((wipSum, boardInfo) => {
      const boardSum = boardInfo.pipelines.reduce((boardWipSum, pipeline) => {
        return PIPELINES_NOT_IN_WIP.includes(pipeline.name) ? boardWipSum : boardWipSum + pipeline.issues.length
      }, 0)
      return wipSum + boardSum
    }, 0)

    // compute throughput, leadTime, and cycleTime
    const reposIssues = await getIssuesForRepos(repos.repos)
    reposIssues.forEach((repoIssues, i) => {
      const boardRepo = repos.repos[i]
      console.log(`Found ${repoIssues.length} recently closed issues in ${boardRepo.cached_repo_name} repo.`)
    })
    const issues = zipReposIssues(repos.repos, reposIssues)
    // console.log('issues:', issues)
    const issuesEvents = await getIssuesEvents(issues)
    const issuesWithEvents = issues.map((issue, i) => Object.assign({}, issue, {events: issuesEvents[i]}))
    // console.log('issuesWithEvents:', issuesWithEvents)
    console.log(`Computing leadTime and cycleTime for ${repoName} repo ...`)
    const issuesWithMetrics = getIssuesMetrics(issuesWithEvents)
    // console.log('leadTimes:', issuesWithMetrics.map(issue => issue.leadTime))
    const leadTime = issuesWithMetrics.reduce((sum, issue) => {
      return sum + issue.leadTime
    }, 0) / issuesWithMetrics.length
    // console.log('cycleTimes:', issuesWithMetrics.map(issue => issue.cycleTime))
    const cycleTime = issuesWithMetrics.reduce((sum, issue) => {
      return sum + issue.cycleTime
    }, 0) / issuesWithMetrics.length

    return {
      name: repoName,
      metrics: {leadTime, cycleTime, wip, throughput: issuesWithMetrics.length},
    }
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}

async function computeMetrics() {
  try {
    const reposToCompute = process.env.GITHUB_REPOS.split(',')
    console.log(`Computing metrics for repos: ${reposToCompute}`)
    const promises = reposToCompute.map(repoName => computeMetricsForRepo(repoName))
    const projects = await Promise.all(promises)

    // save the output to a JSON file
    const dataDir = path.join(__dirname, '..', 'data')
    const dataFile = path.join(dataDir, 'projects.json')
    console.log(`Writing data to ${dataFile} ...`)
    await mkdirp(dataDir)
    fs.writeFileSync(dataFile, JSON.stringify(projects))
    console.log('Done!')
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}

export default computeMetrics

if (!module.parent) {
  computeMetrics()
}
