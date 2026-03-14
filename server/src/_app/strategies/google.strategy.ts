import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'

import { User } from '@/user/entity/user.entity'
import { UserService } from '@/user/service/user.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
  ) {
    super({
      clientID: _configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: _configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: _configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    })
  }

  /**
   * @description Called by Passport after Google resolves the OAuth code.
   * Responsible for finding or creating the user in your database.
   *
   * @param _accessToken  - Google access token (not stored — not needed with JWT)
   * @param _refreshToken - Google refresh token (not stored — we issue our own JWT)
   * @param profile       - Google profile resolved from the OAuth code
   * @param done          - Passport callback: done(error, user)
   */
  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
    const email = profile.emails?.[0]?.value
    if (!email) throw new UnauthorizedException('Google account has no email')

    const googleProfile = {
      googleId: profile.id,
      email: email,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value ?? null,
    }

    return this._userService.validateGoogleUser(googleProfile)
  }
}
