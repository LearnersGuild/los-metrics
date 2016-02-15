import {combineReducers} from 'redux'

import {routeReducer} from 'redux-simple-router'

import {auth} from './auth'
import {errors} from './errors'
import {metrics} from './metrics'

const rootReducer = combineReducers({
  routing: routeReducer,
  auth,
  errors,
  metrics,
})

export default rootReducer
