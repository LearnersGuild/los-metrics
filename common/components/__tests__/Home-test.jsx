/* eslint-disable no-undef */

jest.dontMock('../Home')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

const Home = require('../Home').default

describe('Home', () => {
  // This is admittedly a stupid test, but it's here just to demonstrate
  // best practices around testing.
  it('links to the API docs', () => {
    const home = TestUtils.renderIntoDocument(
      <Home />
    )
    const homeNode = ReactDOM.findDOMNode(home)

    expect(homeNode.textContent).toContain('View API Docs')
  })
})
