import fetch from 'isomorphic-fetch'

const DEFAULT_HEADERS = {
  Accept: 'application/json',
}

class APIError extends Error {
  constructor(status, statusText, url) {
    const message = `API Error ${status} (${statusText}) trying to invoke API (url = '${url}')`
    super(message)
    this.name = 'APIError'
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

export default function apiFetch(url, opts = {}) {
  const headers = Object.assign({}, DEFAULT_HEADERS, opts.headers)
  const options = Object.assign({}, opts, {headers})
  return fetch(url, options)
    .then(resp => {
      if (!resp.ok) {
        throw new APIError(resp.status, resp.statusText, url)
      }
      return resp.json()
    })
}
