import jwt from 'express-jwt'

export default function configureAuth0(app) {
  return new Promise((resolve) => {
    // Ensure that the caller has a valid JWT token to access this API.
    const jwtCheck = jwt({
      audience: process.env.AUTH0_CLIENT_ID,
      secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    }).unless({
      path: [
        '/',          // home page
        '/api-docs',  // swagger integration
        /^\/docs\//,  // swagger docs
      ]
    })
    app.use('/', jwtCheck)

    return resolve()
  })
}
