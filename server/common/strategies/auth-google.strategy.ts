import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20'

// #region imports
import { IdentityService } from '@/modules/identity/identity.service'
// #endregion

/**
 * @class AuthGoogleStrategy
 * @extends {PassportStrategy}
 * @decorator @Injectable()
 *
 * Google OAuth 2.0 Authentication Strategy
 *
 * Implements a Passport.js Google OAuth 2.0 strategy for authenticating users via Google.
 * Handles the OAuth 2.0 flow including redirects to Google's authorization endpoint and
 * processing the authorization code callback to exchange for user profile information.
 *
 * Supports both:
 * - Initial Google login (creates new identity or existing user link)
 * - Linking Google account to an already-logged-in account (via state parameter with link token)
 */
@Injectable()
class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  /**
   * Initializes the Google OAuth 2.0 strategy with Passport configuration
   *
   * @param {ConfigService} _configService - NestJS configuration service for retrieving environment variables
   * @param {IdentityService} _identityService - Service for managing user identities and OAuth links
   *
   * @throws {Error} If any required environment variables are not configured:
   *   - GOOGLE_CLIENT: Google OAuth 2.0 Client ID
   *   - GOOGLE_SECRET: Google OAuth 2.0 Client Secret
   *   - GOOGLE_CALLBACK: OAuth 2.0 callback URL (redirect URI registered with Google)
   */
  constructor(
    private readonly _configService: ConfigService,
    private readonly _identityService: IdentityService
  ) {
    super({
      clientID: _configService.getOrThrow<string>('GOOGLE_CLIENT'),
      clientSecret: _configService.getOrThrow<string>('GOOGLE_SECRET'),
      callbackURL: _configService.getOrThrow<string>('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    })
  }

  public validate = (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    const { id, emails, displayName, photos } = profile

    const googleProfile = {
      googleId: id,
      email: emails?.[0]?.value ?? null,
      isEmailVerified: emails?.[0]?.verified ?? true,
      displayName,
      avatarUrl: photos?.[0]?.value ?? null,
    }
    // `state` carries an optional signed "link token" when this call is an
    // "add Google to my already-logged-in account" request — see
    // AuthController.linkGoogleStart / GoogleAuthGuard.
    done(null, { googleProfile })
  }
}
export { AuthGoogleStrategy }
