import decamelizeKeys from 'decamelize-keys'

import config from 'config'

import {apiFetch} from '../util/apiFetch'

function apiHeaders(key) {
  const baseHeaders = {
    'Content-Type': 'application/json',
  }
  return {
    ...baseHeaders,
    Authorization: key,
  }
}
const readHeaders = projectName => apiHeaders(config.get(`api.keen.projects.${projectName}.readKey`))
const writeHeaders = projectName => apiHeaders(config.get(`api.keen.projects.${projectName}.writeKey`))

function apiProjectURL(projectName, path) {
  const projectId = config.get(`api.keen.projects.${projectName}.projectId`)
  const projectPath = `/projects/${projectId}`
  return `${config.get('api.keen.baseURL')}${projectPath}${path}`
}

export function saveEvent(projectName, eventCollection, event) {
  const url = apiProjectURL(projectName, `/events/${eventCollection}`)
  const headers = writeHeaders(projectName)

  return apiFetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(event),
  })
}

export function getAnalysis(projectName, queryName, options) {
  const url = apiProjectURL(projectName, `/queries/${queryName}`)
  const headers = readHeaders(projectName)
  const filters = options.filters ? options.filters.map(f => decamelizeKeys(f)) : []
  const body = {...decamelizeKeys(options), filters}

  return apiFetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}
