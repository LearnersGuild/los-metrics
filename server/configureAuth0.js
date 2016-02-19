/* eslint-disable camelcase */
import fetch from 'isomorphic-fetch'
import jwt from 'express-jwt'

import passport from 'passport'
import Auth0Strategy from 'passport-auth0'

function configureJWTCheckForAPI(app) {
  // Ensure that the caller has a valid JWT token to access this API.
  const jwtCheck = jwt({
    audience: process.env.AUTH0_CLIENT_ID,
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  }).unless({
    path: [
      '/',          // home page
      '/api-docs',  // swagger integration
      /^\/docs\//,  // swagger docs
      /\/auth\/.+/, // auth routes
    ]
  })
  app.use(jwtCheck)
}

function configureProfileDecoration(app) {
  app.use(async (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
      return next()
    }

    try {
      const idToken = req.cookies.jwt
      const profile = await fetch('https://learnersguild.auth0.com/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_token: idToken,
        })
      }).then(resp => {
        if (resp.status !== 200) {
          res.clearCookie('jwt')
          throw new Error("Couldn't get user profile using JWT. Most likely it expired.")
        }
        return resp.json()
      })

      req.user = {idToken, profile}
      next()
    } catch (err) {
      console.error(err)
      next()
    }
  })
}

function configureAuth0Strategy(app) {
  const strategy = new Auth0Strategy({
    domain: 'learnersguild.auth0.com',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/auth/callback',
  }, (accessToken, refreshToken, extraParams, profile, done) => {
    const user = {accessToken, idToken: extraParams.id_token, profile: profile._json}
    return done(null, user)
  })

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
  passport.use(strategy)
  app.use(passport.initialize())
}

function configureAuthRoutes(app) {
  app.get('/auth/callback',
    passport.authenticate('auth0', {failureRedirect: '/auth/google'}),
    (req, res) => {
      if (!req.user) {
        throw new Error('user null')
      }
      res.cookie('jwt', req.user.idToken, {secure: process.env.NODE_ENV === 'production', httpOnly: true})
      res.redirect('/')
    }
  )

  app.get('/auth/google', passport.authenticate('auth0', {
    connection: 'google-oauth2',
    scope: 'openid email',
  }))
}

export default function configureAuth0(app) {
  return new Promise(resolve => {
    // all API calls need a proper JWT
    configureJWTCheckForAPI(app)
    // if a JWT cookie is found, grab the user from Auth0 and attach it to the request for
    // server-side rendering
    configureProfileDecoration(app)
    // set up passport for Auth0
    configureAuth0Strategy(app)
    // route handlers for authentication via Auth0 (OAuth2)
    configureAuthRoutes(app)

    return resolve()
  })
}
