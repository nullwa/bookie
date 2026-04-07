import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '@/user/service/user.service'
import { eUserRole } from '../constants/enum'

/**
 * JwtStrategy — runs on every protected route via the global JwtAuthGuard.
 *
 * Passport extracts the Bearer token from the Authorization header,
 * verifies its signature against AUTH_JWT_SECRET, checks expiration,
 * then calls validate() with the decoded payload.
 *
 * The returned object is attached to req.user and made available
 * to all downstream guards (@Roles, @Abilities) and route handlers.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow<string>('AUTH_JWT_ACCESS_SECRET'),
    })
  }

  /**
   * @description Called by Passport after successful JWT verification.
   * Payload is already verified (signature + expiration) at this point.

   * @param payload - Decoded JWT payload
   * @returns RequestUser — attached to req.user by Passport
   */
  public validate = async (payload: { sub: number; email: string; role: string; abilities: string[]; type: string; iat?: number; exp?: number }): Promise<{ sub: number; email: string; role: string; abilities: string[]; type: string }> => {
    if (!payload.sub || !payload.email) throw new UnauthorizedException('Invalid token payload')
    // reject any token issued before the last passowrd reset
    if (payload.iat) {
      const user = await this._userService.findOne(payload.sub, eUserRole.ADMIN) // only need to check admin users since only they can change their password
      if (user?.passwordChangedAt) {
        const issuedAt = payload.iat * 1000 // JWT iat is in seconds
        if (issuedAt < user.passwordChangedAt.getTime()) throw new UnauthorizedException('Token has been invalidated. Please log in again.')
      }
    }
    return { sub: payload.sub, email: payload.email, role: payload.role, abilities: payload.abilities, type: payload.type }
  }
}
