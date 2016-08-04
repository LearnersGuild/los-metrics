import apiFetch from '../util/apiFetch'

function apiURL(path, baseURL = 'https://codeclimate.com/api', apiToken = process.env.CODECLIMATE_API_TOKEN) {
  return `${baseURL}/${path}?api_token=${apiToken}`
}

export function getRepositoryIds() {
  return apiFetch(apiURL('/repos'))
    .then(repos => repos.map(repo => repo.id))
}

export function getRepositoryMetrics(repoId) {
  return apiFetch(apiURL(`/repos/${repoId}`))
}
