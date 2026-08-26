import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20'

import { UserService } from '@/modules/user/services/user.service'

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService
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
