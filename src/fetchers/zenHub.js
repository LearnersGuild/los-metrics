import config from 'config'

import apiFetch from '../util/apiFetch'

const headers = {
  'x-authentication-token': config.get('api.zenHub.token'),
}

function apiURL(path) {
  return `${config.get('api.zenHub.baseURL')}/${path}`
}

export function getReposForBoard(repoId) {
  const reposUrl = apiURL(`/v4/repos/${repoId}/board/repos`)
  return apiFetch(reposUrl, {headers})
}

export function getBoardInfo(repoId) {
  const boardUrl = apiURL(`/p1/repositories/${repoId}/board`)
  return apiFetch(boardUrl, {headers})
}

export function getIssueEvents(issue) {
  const issueEventsUrl = apiURL(`/p1/repositories/${issue.repo_id}/issues/${issue.number}/events`)
  return apiFetch(issueEventsUrl, {headers})
}
