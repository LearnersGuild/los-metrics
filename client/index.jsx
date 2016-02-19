/* global window, document */
import React from 'react'
import {render} from 'react-dom'

import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'

import {Router} from 'react-router'
import {createHistory} from 'history'
import {syncHistory} from 'react-router-redux'

import getRoutes from '../common/routes'
import rootReducer from '../common/reducers'

const initialState = window.__INITIAL_STATE__

const store = createStore(rootReducer, initialState, compose(
  applyMiddleware(thunk),
))
const history = createHistory()

syncHistory(history, store)

render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
)
