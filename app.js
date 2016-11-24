/* eslint-disable no-var, prefer-arrow-callback */
var express = require('express')

var port = process.env.PORT || 5000
var app = express()

app.use(express.static('public'))
app.listen(port, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info(`🌍  Listening on port ${port}`)
  }
})
