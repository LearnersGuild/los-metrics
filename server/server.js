/* eslint-disable no-console, no-undef */
process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'
import enforceSecure from 'express-sslify'
import cookieParser from 'cookie-parser'

import {Monitor} from 'forever-monitor'

import configureDevEnvironment from './configureDevEnvironment'
import configureAuth0 from './configureAuth0'
import configureSwagger from './configureSwagger'
import handleRender from './render'

function startJob() {
  const scriptFile = path.join(__dirname, 'configureScheduler.babel.js')
  const child = new Monitor(scriptFile, {
    max: 3,
    silent: false,
    args: [],
  })

  child.on('exit', event => {
    console.log(`${scriptFile} exited after ${event.times} runs.`)
  })

  child.start()
}

export function start() {
  const serverPort = parseInt(process.env.PORT, 10)
  const baseUrl = process.env.APP_BASEURL || `http://localhost:${serverPort}`

  startJob()

  const app = new Express()

  if (__DEVELOPMENT__) {
    configureDevEnvironment(app)
  }

  // Parse cookies.
  app.use(cookieParser())

  // Ensure secure connection in production.
  if (process.env.NODE_ENV === 'production') {
    app.use(enforceSecure.HTTPS({trustProtoHeader: true}))
  }

  // Use this middleware to server up static files
  app.use(serveStatic(path.join(__dirname, '../dist')))
  app.use(serveStatic(path.join(__dirname, '../public')))

  return Promise.all([
    configureAuth0(app),
    configureSwagger(app),
  ]).then(() => {
    // Default React application
    app.get('/', handleRender)

    return app.listen(serverPort, error => {
      if (error) {
        console.error(error)
      } else {
        console.info('🌍  Listening at %s', baseUrl)
      }
    })
  })
}
