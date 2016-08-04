import apiFetch from '../util/apiFetch'

function headers(apiToken) {
  return {
    'x-authentication-token': apiToken,
  }
}

export function getReposForBoard(repoId, apiToken = process.env.ZENHUB_PRIVATE_API_TOKEN) {
  const reposUrl = `https://api.zenhub.io/v4/repos/${repoId}/board/repos`
  return apiFetch(reposUrl, {headers: headers(apiToken)})
}

export function getBoardInfo(repoId, apiToken = process.env.ZENHUB_PRIVATE_API_TOKEN) {
  const boardUrl = `https://api.zenhub.io/p1/repositories/${repoId}/board`
  return apiFetch(boardUrl, {headers: headers(apiToken)})
}

export function getIssueEvents(issue, apiToken = process.env.ZENHUB_PRIVATE_API_TOKEN) {
  const issueEventsUrl = `https://api.zenhub.io/p1/repositories/${issue.repo_id}/issues/${issue.number}/events`
  return apiFetch(issueEventsUrl, {headers: headers(apiToken)})
}
