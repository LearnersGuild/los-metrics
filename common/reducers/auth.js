import {LOAD_METRICS_UNAUTHORIZED} from '../actions/loadMetrics'

const initialState = {
  currentUser: null,
  isSigningIn: false,
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case LOAD_METRICS_UNAUTHORIZED:
      console.error('Unauthorized:', action.error)
      return Object.assign({}, state, {
        currentUser: null,
        isSigningIn: false,
      })
    default:
      return state
  }
}
