import fetch from 'isomorphic-fetch'

export const LOAD_METRICS_REQUEST = 'LOAD_METRICS_REQUEST'
export const LOAD_METRICS_SUCCESS = 'LOAD_METRICS_SUCCESS'
export const LOAD_METRICS_UNAUTHORIZED = 'LOAD_METRICS_UNAUTHORIZED'
export const LOAD_METRICS_FAILURE = 'LOAD_METRICS_FAILURE'

function loadMetricsRequest() {
  return {type: LOAD_METRICS_REQUEST}
}

function loadMetricsSuccess(projects) {
  return {type: LOAD_METRICS_SUCCESS, projects}
}

function loadMetricsUnauthorized(error) {
  return {type: LOAD_METRICS_UNAUTHORIZED, error}
}

function loadMetricsFailure(error) {
  return {type: LOAD_METRICS_FAILURE, error}
}

export default function loadMetrics() {
  return (dispatch, getState) => {
    const {auth} = getState()
    if (auth.currentUser && auth.currentUser.idToken) {
      dispatch(loadMetricsRequest())
      fetch('/projects/metrics', {
        headers: {
          Authorization: `Bearer ${auth.currentUser.idToken}`
        },
      }).then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
          return resp.json()
        } else if (resp.status >= 400 && resp.status < 500) {
          dispatch(loadMetricsUnauthorized(resp.statusText))
        } else {
          throw new Error(resp.statusText)
        }
      }).then(projects => dispatch(loadMetricsSuccess(projects)))
      .catch(error => {
        dispatch(loadMetricsFailure(error))
      })
    }
  }
}
