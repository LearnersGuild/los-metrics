import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import Keen from 'keen-js'

import Root from './Root'

const rootEl = document.getElementById('root')

Keen.ready(() => {
  render(
    <AppContainer><Root/></AppContainer>,
    rootEl
  )
})

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default
    render(
      <AppContainer><NextRoot/></AppContainer>,
      rootEl
    )
  })
}
