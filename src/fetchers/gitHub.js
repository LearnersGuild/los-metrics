import config from 'config'

import apiFetch from '../util/apiFetch'

const headers = {
  Authorization: `token ${config.get('api.gitHub.token')}`,
  Accept: 'application/vnd.github.v3+json',
}

function apiURL(path) {
  return `${config.get('api.gitHub.baseURL')}${path}`
}

export function getRepo(repoName) {
  const repoUrl = apiURL(`/repos/LearnersGuild/${repoName}`)
  return apiFetch(repoUrl, {headers})
}

export function getClosedIssuesForRepoSince(repoName, sinceDate) {
  const issuesUrl = apiURL(`/repos/LearnersGuild/${repoName}/issues?state=closed&since=${sinceDate.toISOString()}`)
  return apiFetch(issuesUrl, {headers})
}
