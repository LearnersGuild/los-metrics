import config from 'config'

import {apiFetch} from '../util/apiFetch'

const headers = {
  Authorization: `Token token=${config.get('api.codeClimate.token')}`,
  Accept: 'application/vnd.api+json',
}

function apiURL(path) {
  return `${config.get('api.codeClimate.baseURL')}${path}`
}

export function getRepositoryInfo(githubSlug) {
  return apiFetch(apiURL(`/repos?github_slug=${githubSlug}`), {headers})
}

export function getRepositoryTestReports(repoId) {
  return apiFetch(apiURL(`/repos/${repoId}/test_reports`), {headers})
}
