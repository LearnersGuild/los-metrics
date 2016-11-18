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

/* eslint-disable camelcase */
export function getLastEventForCollection(projectName, collectionName) {
  const tsUrl = apiProjectURL(projectName, '/queries/extraction')
  const headers = readHeaders(projectName)
  const body = JSON.stringify({
    event_collection: collectionName,
    timeframe: 'this_10_years',  // arbitrarily long ago
    latest: 1,
  })

  return apiFetch(tsUrl, {
    method: 'POST',
    headers,
    body,
  })
}

export function saveIssueMetrics(issue) {
  const projectName = 'flow'
  const collectionName = 'issues'
  const headers = writeHeaders(projectName)
  const newIssueUrl = apiProjectURL(projectName, `/events/${collectionName}`)

  return apiFetch(newIssueUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(issue),
  })
}
