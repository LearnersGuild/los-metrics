import { combineReducers } from 'redux'

import { routeReducer } from 'redux-simple-router'

import { auth } from './auth'
import { metrics } from './metrics'

const rootReducer = combineReducers({
  routing: routeReducer,
  auth,
  metrics,
})

export default rootReducer
