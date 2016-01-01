/* eslint-disable no-undef */

jest.dontMock('../SignIn')

import React from 'react'
import TestUtils from 'react-addons-test-utils'

const SignIn = require('../SignIn').default

describe('SignIn', () => {
  it('signs-in when the sign-in button is clicked', () => {
    let clicked = false
    const signIn = TestUtils.renderIntoDocument(
      <SignIn onSignIn={() => clicked = true}/>
    )
    const signInButton = signIn.refs.signInButton
    TestUtils.Simulate.click(signInButton)

    expect(clicked).toBeTruthy()
  })
})
