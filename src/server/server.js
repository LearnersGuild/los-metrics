import config from 'config'
import express from 'express'

import configureServer from './configureServer'

const app = express()

configureServer(app)

app.use(express.static('public'))
app.listen(config.server.port, error => {
  if (error) {
    console.error(error)
  } else {
    console.info(`🌍  Listening at ${config.server.baseURL} on port ${config.server.port}`)
  }
})
