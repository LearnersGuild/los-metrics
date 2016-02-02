import React from 'react'
import { render } from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import { Router } from 'react-router'
import { createHistory } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'

import Auth0 from 'auth0-js'

import getRoutes from '../common/routes'
import rootReducer from '../common/reducers'


function startApp() {
  const sessionUser = sessionStorage.currentUser ? JSON.parse(sessionStorage.currentUser) : null
  const initialState = window.__INITIAL_STATE__ || {}
  initialState.auth = initialState.auth || {}
  initialState.auth.currentUser = initialState.auth.currentUser || sessionUser

  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
  const store = createStoreWithMiddleware(rootReducer, initialState)
  const history = createHistory()

  syncReduxAndRouter(history, store)
  render(
    <Provider store={store}>
      <Router history={history}>
        {getRoutes(store)}
      </Router>
    </Provider>,
    document.getElementById('root')
  )
}

function authenticateAndStartApp() {
  if (sessionStorage.currentUser) {
    startApp()
  } else {
    const auth0 = new Auth0({
      domain: 'learnersguild.auth0.com',
      callbackOnLocationHash: true,
      clientID: 'k9dzsGQ9h8x7TcB3JjSBdIKL32I6Fkgb', // TODO: use environment
    })
    const result = auth0.parseHash(window.location.hash)
    if (result && result.id_token) {
      // console.log('result:', result)
      auth0.getProfile(result.id_token, (err, profile) => {
        if (err) {
          console.log(`error: ${err}`)
          return
        }
        const user = { profile, idToken: result.id_token, accessToken: result.access_token, state: result.state }
        sessionStorage.currentUser = JSON.stringify(user)
        const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`
        window.location.replace(url)
      })
    } else if (result && result.error) {
      console.log(`error: ${result.error}`)
      return
    } else {
      auth0.login({ connection: 'google-oauth2', popup: false })
    }
  }
}


authenticateAndStartApp()
