import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import type { Request } from 'express'

/**
 * @class AuthGoogleGuard
 * @description used exclusively on Google OAuth routes.
 *
 * GET /auth/google          → triggers redirect to Google consent screen
 * GET /auth/google/callback → triggers GoogleStrategy.validate() with resolved profile
 *
 * These routes must also be decorated with @Public() so the global
 * JwtAuthGuard does not reject them (they have no JWT yet).
 */
@Injectable()
class AuthGoogleGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const state = typeof request.query?.state === 'string' ? request.query.state : undefined
    return state ? { state } : undefined
  }
}
export { AuthGoogleGuard }
