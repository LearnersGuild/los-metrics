import {CLEAR_ERRORS} from '../actions/clearErrors'
import {LOAD_METRICS_FAILURE, LOAD_METRICS_UNAUTHORIZED} from '../actions/loadMetrics'

const initialState = {
  message: null,
}

export function errors(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ERRORS:
      return Object.assign({}, {message: null})
    case LOAD_METRICS_UNAUTHORIZED:
    case LOAD_METRICS_FAILURE:
      return Object.assign({}, {message: action.error})
    default:
      return state
  }
}
