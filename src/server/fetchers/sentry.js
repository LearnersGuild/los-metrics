import config from 'config'
import queryString from 'query-string'

import {apiFetch, apiFetchAllPages} from '../util/apiFetch'

const headers = {
  Authorization: `Bearer ${config.get('api.sentry.token')}`,
  Accept: 'application/json',
}

function apiURL(path, query = {}) {
  const search = Object.keys(query).length > 0 ? `?${queryString.stringify(query)}` : ''
  const url = `${config.get('api.sentry.baseURL')}${path}/${search}`
  return url
}

export function getProjects() {
  return apiFetch(apiURL('/projects'), {headers})
}

export function getIssuesForProject(projectSlug, query) {
  const orgSlug = config.get('api.sentry.orgSlug')
  const issuesUrl = apiURL(`/projects/${orgSlug}/${projectSlug}/issues`, query)
  return apiFetchAllPages(issuesUrl, {headers})
}
