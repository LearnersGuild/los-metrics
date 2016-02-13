/* eslint-disable no-undef */

import fetch from 'isomorphic-fetch'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import { RoutingContext, match } from 'react-router'

import getRoutes from '../common/routes'
import rootReducer from '../common/reducers'
import iconsMetadata from '../dist/icons-metadata'


function renderFullPage(renderedAppHtml, initialState) {
  const title = 'Product Metrics'
  let appCss = ''
  if (!__DEVELOPMENT__) {
    appCss = `<link href="/app.css" media="screen,projection" rel="stylesheet" type="text/css" />`
  }

  return `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Identity Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

        ${iconsMetadata.join('\n        ')}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
        ${appCss}
      </head>
      <body>

        <div id="root">${renderedAppHtml}</div>

        <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
        <script src="/app.js"></script>

      </body>
    </html>
    `
}

function fetchAllComponentData(dispatch, routes) {
  const funcs = routes.map((route) => {
    if (route.component && typeof(route.component.fetchData === 'function')) {
      return route.component.fetchData(dispatch)
    }
  })
  return Promise.all(funcs)
}

export default function handleRender(req, res) {
  try {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
    const store = createStoreWithMiddleware(rootReducer)

    match({ routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
      // console.log('error:', error, 'redirectLocation:', redirectLocation, 'renderProps:', renderProps)
      if (error) {
        throw new Error(error)
      } else if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search)
      } else if (!renderProps) {
        res.status(404).send(`<h1>404 - Not Found</h1><p>No such URL: ${req.originalUrl}</p>`)
      } else {
        fetchAllComponentData(store.dispatch, renderProps.routes)
          .then(() => {
            const renderedAppHtml = renderToString(
              <Provider store={store}>
                <RoutingContext {...renderProps}/>
              </Provider>
            )
            res.send(renderFullPage(renderedAppHtml, store.getState()))
          }).catch((fetchError) => {
            throw new Error(fetchError)
          })
      }
    })
  } catch (error) {
    res.status(500).send(`<h1>500 - Internal Server Error</h1><p>${error}</p>`)
  }
}
