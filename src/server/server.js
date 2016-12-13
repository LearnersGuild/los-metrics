import http from 'http'
import config from 'config'
import express from 'express'
import {HTTPS as https} from 'express-sslify'
import cookieParser from 'cookie-parser'

import configureServer from './configureServer'
import configureAuth from './configureAuth'

const app = express()
const httpServer = http.createServer(app)

configureServer(app)

app.use(cookieParser())
if (config.app.secure) {
  /* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */
  app.use(https({trustProtoHeader: true}))
}

configureAuth(app)

app.use(express.static('public'))

httpServer.listen(config.app.port, error => {
  if (error) {
    console.error(error)
  } else {
    console.info(`🌍  Listening at ${config.app.baseURL} on port ${config.app.port}`)
  }
})
