import config from 'config'

import {apiFetch} from '../util/apiFetch'

function apiURL(path) {
  return `${config.get('api.codeClimate.baseURL')}${path}?api_token=${config.get('api.codeClimate.token')}`
}

export function getRepositories() {
  return apiFetch(apiURL('/repos'))
}

export function getRepositoryMetrics(repoId) {
  return apiFetch(apiURL(`/repos/${repoId}`))
}
