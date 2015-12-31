/* eslint-disable no-undef */
const Auth0 = __CLIENT__ ? require('auth0-js') : null

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE'

function signInRequest(connection) {
  return { type: SIGN_IN_REQUEST, connection }
}

function signInSuccess(user) {
  return { type: SIGN_IN_SUCCESS, user }
}

function signInFailure(error) {
  return { type: SIGN_IN_FAILURE, error }
}

export function signIn(connection) {
  return dispatch => {
    dispatch(signInRequest(connection))

    if (__CLIENT__) {
      const auth0 = new Auth0({
        domain: 'learnersguild.auth0.com',
        callbackOnLocationHash: true,
        clientID: 'k9dzsGQ9h8x7TcB3JjSBdIKL32I6Fkgb', // TODO: use environment
      })
      auth0.login({ connection, popup: true }, (err, profile, idToken, accessToken, state) => {
        if (err) {
          dispatch(signInFailure(`Error signing-in: ${err.message}`))
        }
        const user = { profile, idToken, accessToken, state }
        dispatch(signInSuccess(user))
      })
    } else {
      dispatch(signInFailure("Can't use auth0-js to sign-in on server."))
    }
  }
}
