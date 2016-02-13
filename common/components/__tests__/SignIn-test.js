import test from 'ava'

import React from 'react'
import TestUtils from 'react-addons-test-utils'

// test.before(() => {
// })

test('SignIn signs-in when the sign-in button is clicked', t => {
  t.plan(1)

  const SignIn = require('../SignIn')
  let clicked = false
  const signIn = TestUtils.renderIntoDocument(
    React.createElement(SignIn, {onSignIn: () => clicked = true})
  )

  const signInButton = signIn.refs.signInButton
  TestUtils.Simulate.click(signInButton)

  t.ok(clicked)
})
