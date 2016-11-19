import {getBoardInfo, getIssueEvents} from '../../fetchers/zenHub'
import {getIssuesForRepo} from '../../fetchers/gitHub'
import {composeIssue} from './issueUtil'
import {wip as computeWip} from './kanban'

export function getBoardInfoForRepos(repos) {
  const promises = repos.map(repo => getBoardInfo(repo.repo_id))
  return Promise.all(promises)
}

export function issueDataForGitHubIssue(repo) {
  return async ghIssue => {
    try {
      const zhIssueEvents = await getIssueEvents(repo, ghIssue)
      return {repo, ghIssue, zhIssueEvents}
    } catch (err) {
      throw err
    }
  }
}

/* eslint-disable no-console, camelcase */
export async function getIssueDataByRepoIdSince(repos, since, state = 'all') {
  try {
    const promises = repos.map(repo => getIssuesForRepo(repo.cached_repo_name, {state, since: since.toISOString()}))
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

export async function getFlattenedFilteredComposedIssues(newIssuesLane, repos, ghIssuesByRepoId, filter = null) {
  try {
    let issueDataPromises = []
    ghIssuesByRepoId.forEach((unfilteredIssues, repoId) => {
      const repo = repos.find(repo => repo.repo_id === repoId)
      const issues = filter ? unfilteredIssues.filter(filter) : unfilteredIssues
      const repoIssueDataPromises = issues.map(issueDataForGitHubIssue(repo))
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

export function computeWipForAllRepos(wipLaneNames, repos, reposBoardInfos, ghIssuesByRepoId) {
  return reposBoardInfos
    .reduce((curr, boardInfo, i) => {
      const repo = repos[i]
      const prIssueNumbers = [...ghIssuesByRepoId.get(repo.repo_id)]
        .filter(issue => Boolean(issue.pull_request))
        .map(issue => issue.number)
      return curr + computeWip(wipLaneNames, boardInfo, prIssueNumbers)
    }, 0)
}
