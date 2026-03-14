import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

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
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow<string>('AUTH_JWT_SECRET'),
    })
  }

  /**
   * @description Called by Passport after successful JWT verification.
   * Payload is already verified (signature + expiration) at this point.

   * @param payload - Decoded JWT payload
   * @returns RequestUser — attached to req.user by Passport
   */
  public validate = async (payload: { sub: string; email: string; role: string; abilities: string[]; iat?: number; exp?: number }): Promise<{ uid: string; email: string; role: string; abilities: string[] }> => {
    if (!payload.sub || !payload.email) throw new Error('Invalid token payload')
    return { uid: payload.sub, email: payload.email, role: payload.role, abilities: payload.abilities }
  }
}
