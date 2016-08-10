import config from 'config'
import queryString from 'query-string'

import {apiFetch, apiFetchAllPages} from '../util/apiFetch'

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

export function getIssuesForRepo(repoName, query = {}) {
  const qs = queryString.stringify(query)
  const issuesUrl = apiURL(`/repos/LearnersGuild/${repoName}/issues?${qs}`)
  return apiFetchAllPages(issuesUrl, {headers})
}
