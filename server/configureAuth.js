import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'

export default function configureAuth(app) {
  app.use(addUserToRequestFromJWT)
  app.use(refreshUserFromIDMService)
  app.use(extendJWTExpiration)
}
