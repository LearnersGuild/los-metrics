import config from 'config'

import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'

export default function configureAuth(app) {
  app.use(addUserToRequestFromJWT)
  app.use((req, res, next) => {
    refreshUserFromIDMService(req, res, err => {
      if (err) {
        console.warn('WARNING: unable to refresh user from IDM service:', err)
      }
      next()
    })
  })
  app.use(extendJWTExpiration)

  app.get('/', (req, res, next) => {
    if (!req.user) {
      const redirectTo = encodeURIComponent(config.app.baseURL)
      return res.redirect(`${config.app.idmBaseURL}/sign-in?redirect=${redirectTo}`)
    } else if (!req.user.roles.includes('staff')) {
      const forbidden = '403 Forbidden'
      res.send(`<!doctype html><html><head><title>${forbidden}</title><body><h1>${forbidden}</h1></body></html>`)
    }
    next()
  })
}
