import { LOAD_METRICS_REQUEST, LOAD_METRICS_SUCCESS, LOAD_METRICS_FAILURE } from '../actions/loadMetrics'

const initialState = {
  projects: [],
  isLoading: false,
}

export function metrics(state = initialState, action) {
  switch (action.type) {
  case LOAD_METRICS_REQUEST:
    return Object.assign({}, state, {
      isLoading: true,
    })
  case LOAD_METRICS_SUCCESS:
    return Object.assign({}, state, {
      projects: action.projects,
      isLoading: false,
    })
  case LOAD_METRICS_FAILURE:
    console.error('Load metrics FAILURE:', action.error)
    return Object.assign({}, state, {
      projects: [],
      isLoading: false,
    })
  default:
    return state
  }
}
