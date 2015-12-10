/* eslint-disable no-console, no-undef */
process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'

import configureDevEnvironment from './configureDevEnvironment'
import configureSwagger from './configureSwagger'
import handleRender from './render'

const serverPort = parseInt(process.env.PORT, 10)
const baseUrl = process.env.APP_BASEURL || `http://localhost:${serverPort}`

const app = new Express()

if (__DEVELOPMENT__) {
  configureDevEnvironment(app)
}

// Use this middleware to server up static files
app.use(serveStatic(path.join(__dirname, '../dist')))
app.use(serveStatic(path.join(__dirname, '../public')))

// Configure Swagger middleware firt, then start app
configureSwagger(app, ()=> {
  // Default React application
  app.get('/', handleRender)

  app.listen(serverPort, (error) => {
    if (error) {
      console.error(error)
    } else {
      console.info('🌍  Listening at %s', baseUrl)
    }
  })
})
