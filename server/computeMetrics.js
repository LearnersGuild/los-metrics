/* eslint-disable no-console, camelcase */
import fs from 'fs'
import path from 'path'
import fetch from 'isomorphic-fetch'
import mkdirp from 'mkdirp'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const ISSUES_CLOSED_SINCE_DATE = new Date()
ISSUES_CLOSED_SINCE_DATE.setDate(ISSUES_CLOSED_SINCE_DATE.getDate() - 7)

function getRepo(repoName) {
  const repoUrl = `https://api.github.com/repos/LearnersGuild/${repoName}`
  return fetch(repoUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  }).then(resp => resp.json())
}

function getReposForBoard(repoId) {
  const reposUrl = `https://api.zenhub.io/v4/repos/${repoId}/board/repos`
  return fetch(reposUrl, {
    headers: {
      'Accept': 'application/json',
      'x-authentication-token': process.env.ZENHUB_PRIVATE_API_TOKEN,
    },
  }).then(resp => resp.json())
}

function getIssuesForRepo(repoName) {
  const issuesUrl = `https://api.github.com/repos/LearnersGuild/${repoName}/issues?state=closed&since=${ISSUES_CLOSED_SINCE_DATE.toISOString()}`
  return fetch(issuesUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  }).then(resp => resp.json())
}

function getIssuesForRepos(repos) {
  const promises = repos.map(repo => getIssuesForRepo(repo.cached_repo_name))
  return Promise.all(promises)
}

function getIssueEvents(issue) {
  const issueEventsUrl = `https://api.zenhub.io/p1/repositories/${issue.repo_id}/issues/${issue.number}/events`
  return fetch(issueEventsUrl, {
    headers: {
      'Accept': 'application/json',
      'x-authentication-token': process.env.ZENHUB_PUBLIC_API_TOKEN,
    },
  }).then(resp => resp.json())
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

async function computeMetricsForRepo(repoName) {
  try {
    const repo = await getRepo(repoName)
    const repos = await getReposForBoard(repo.id)
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
      [repoName]: {leadTime, cycleTime},
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
    const projectsArray = await Promise.all(promises)
    let projects = {}
    for (const i in projectsArray) {
      if (projectsArray.hasOwnProperty(i)) {
        const project = projectsArray[i]
        projects = Object.assign({}, projects, project)
      }
    }

    // save the output to a JSON file
    const dataDir = path.join(__dirname, '..', 'data')
    const dataFile = path.join(dataDir, 'projects.json')
    console.log(`Writing data to ${dataFile} ...`)
    await mkdirp(dataDir)
    await fs.writeFile(dataFile, JSON.stringify(projects))
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
