/* eslint-disable no-undef */

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fetch from 'node-fetch'

import Root from '../common/containers/Root'


function renderFullPage(iconsMetadataTagsHtml, renderedAppHtml, initialState) {
  const { title } = initialState
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

        ${iconsMetadataTagsHtml}
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

export default function handleRender(req, res) {
  const initialState = {
    title: 'Product Metrics'
  }
  const renderedAppHtml = ReactDOMServer.renderToString(
    <Root />
  )
  fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
    .then((resp) => {
      return resp.json()
    }).then((tags) => {
      res.send(renderFullPage(tags.join('\n        '), renderedAppHtml, initialState))
    }).catch(err => res.status(500).send(`Couldn't fetch favicon info from ${process.env.ICONS_SERVICE_TAGS_API_URL}.`))
}
