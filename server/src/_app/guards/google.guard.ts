import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * GoogleAuthGuard — used exclusively on Google OAuth routes.
 *
 * GET /auth/google          → triggers redirect to Google consent screen
 * GET /auth/google/callback → triggers GoogleStrategy.validate() with resolved profile
 *
 * These routes must also be decorated with @Public() so the global
 * JwtAuthGuard does not reject them (they have no JWT yet).
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
