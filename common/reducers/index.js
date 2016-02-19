import {combineReducers} from 'redux'

import {routeReducer} from 'react-router-redux'

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
