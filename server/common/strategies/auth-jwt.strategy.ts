import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// #region imports
import { IdentityService } from '@/modules/identity/identity.service'
// #endregion

/**
 * @class AuthJwtStrategy
 * @extends {PassportStrategy}
 * @decorator @Injectable()
 *
 * JwtStrategy — runs on every protected route via the global JwtAuthGuard.
 *
 * Passport extracts the Bearer token from the Authorization header,
 * verifies its signature against AUTH_JWT_SECRET, checks expiration,
 * then calls validate() with the decoded payload.

 * The returned object is attached to req.user and made available
 * to all downstream guards (@Roles, @Abilities) and route handlers.
 */
@Injectable()
class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Initializes the JWT strategy with Passport configuration
   *
   * @param {ConfigService} _configService - NestJS configuration service for retrieving environment variables
   * @throws {Error} If JWT_SECRET environment variable is not configured
   */
  constructor(
    private readonly _configService: ConfigService,
    private readonly _identityService: IdentityService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow<string>('JWT_SECRET'),
    })
  }

  public validate = async (payload: Typed.Auth.Profile): Promise<Typed.Auth.Profile> => {
    if (!payload.sub || !payload.identifier) throw new UnauthorizedException('invalid token payload')

    const identity = await this._identityService.findUserIdentityByProviderAndIdentifier(payload.provider, payload.identifier)
    if (!identity) throw new UnauthorizedException('invalid token payload')

    return { ...payload }
  }
}
export { AuthJwtStrategy }
