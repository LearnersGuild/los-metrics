import config from 'config'

import apiFetch from '../util/apiFetch'

const publicApiHeaders = {
  'x-authentication-token': config.get('api.zenHub.token'),
}
const unpublishedApiHeaders = {
  'x-authentication-token': config.get('api.zenHub.unpublishedToken'),
}

function apiURL(path) {
  return `${config.get('api.zenHub.baseURL')}${path}`
}

// **NOTE:**
//   this is an undocumented API that I sniffed in Chrome, which is why it needs
//   its own special auth token (also sniffed)
export function getReposForBoard(repoId) {
  const reposUrl = apiURL(`/v4/repos/${repoId}/board/repos`)
  return apiFetch(reposUrl, {headers: unpublishedApiHeaders})
}

export function getBoardInfo(repoId) {
  const boardUrl = apiURL(`/p1/repositories/${repoId}/board`)
  return apiFetch(boardUrl, {headers: publicApiHeaders})
}

export function getIssueEvents(repo, issue) {
  const issueEventsUrl = apiURL(`/p1/repositories/${repo.repo_id}/issues/${issue.number}/events`)
  return apiFetch(issueEventsUrl, {headers: publicApiHeaders})
}
