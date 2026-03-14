import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { ROLES_KEY } from '@/_app/decorators/role.decorator'
import { ABILITIES_KEY } from '@/_app/decorators/abilities.decorator'
import { IS_PUBLIC_KEY } from '@/_app/decorators/public.decorator'
import { ROLE_ABILITIES } from '@/_app/constants/const'

/**
 * JwtAuthGuard — registered globally via APP_GUARD in AuthModule.
 *
 * Replaces your existing manual canActivate implementation.
 * Delegates JWT verification to Passport (JwtStrategy) instead of
 * calling jwtService.verifyAsync() manually.
 *
 * Execution order for every incoming request:
 *  1. @Public() check    → skip all checks if route is public
 *  2. JWT verification   → via super.canActivate() → JwtStrategy.validate()
 *  3. @Roles() check     → validate user role against required roles
 *  4. @Abilities() check → validate role permissions + user abilities
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  /**
   * @description This guard checks if the route is public, validates the JWT token, checks user roles and abilities.
   * @param context
   * @returns boolean
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const cls = context.getClass()

    // ── 1. Public route ──────────────────────────────────────────────────────
    // Routes decorated with @Public() bypass all auth checks entirely.
    // Used for: POST /auth/login, GET /auth/google, GET /auth/google/callback
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, cls])
    if (isPublic) return true

    // ── 2. JWT verification ──────────────────────────────────────────────────
    // Delegates to Passport's AuthGuard('jwt') which:
    //   a) Extracts Bearer token from Authorization header
    //   b) Verifies signature + expiration against AUTH_JWT_SECRET
    //   c) Calls JwtStrategy.validate(payload) → sets req.user
    //
    // Throws UnauthorizedException automatically if token is missing/invalid.
    const isAuthenticated = (await super.canActivate(context)) as boolean
    if (!isAuthenticated) throw new UnauthorizedException('Authentication failed')

    const request = context.switchToHttp().getRequest()
    const user: { uid: string; email: string; role: string; abilities: string[] } = request.user

    // ── 3. Role check ────────────────────────────────────────────────────────
    // If @Roles(...) is present, user.role must be in the allowed list.
    // If no @Roles() decorator → role check is skipped (any authenticated user passes).
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [handler, cls])
    if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied: role '${user.role}' is not permitted. Required: [${requiredRoles.join(', ')}]`)
    }

    // ── 4. Ability check ─────────────────────────────────────────────────────
    // Two-layer check when @Abilities(...) is present:
    //
    //  a) Role-level gate: are these abilities even allowed for this role?
    //     Prevents privilege escalation where a user somehow has abilities
    //     that their role should never have.
    //
    //  b) User-level gate: does this specific user actually have the abilities?
    //     Abilities are granular permissions assigned per user within their role.
    const requiredAbilities = this.reflector.getAllAndOverride<string[]>(ABILITIES_KEY, [handler, cls])
    if (requiredAbilities?.length) {
      const roleAbilities: string[] = ROLE_ABILITIES[user.role] ?? []

      // a) Validate abilities are permitted for this role
      const forbiddenForRole = requiredAbilities.filter((a) => !roleAbilities.includes(a))
      if (forbiddenForRole.length) {
        throw new ForbiddenException(`Access denied: abilities [${forbiddenForRole.join(', ')}] are not permitted for role '${user.role}'`)
      }

      // b) Validate user actually holds the required abilities
      const userAbilities: string[] = user.abilities ?? []
      const missingAbilities = requiredAbilities.filter((a) => !userAbilities.includes(a))
      if (missingAbilities.length) {
        throw new ForbiddenException(`Access denied: user is missing required abilities [${missingAbilities.join(', ')}]`)
      }
    }

    return true
  }
}
