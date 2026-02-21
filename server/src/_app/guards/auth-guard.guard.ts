import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { ROLES_KEY } from '@/_app/decorators/role.decorator';
import { ABILITIES_KEY } from '@/_app/decorators/abilities.decorator';
import { IS_PUBLIC_KEY } from '@/_app/decorators/public.decorator';
import { ROLE_ABILITIES } from '@/_app/constants/const';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) { }
  /**
   * @description This guard checks if the route is public, validates the JWT token, checks user roles and abilities.
   * @param context
   * @returns boolean
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const cls = context.getClass();

    // 1️⃣ Public route?
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, cls]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    // 2️⃣ JWT validation
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Missing token');

    let user: any;
    try {
      user = await this.jwtService.verifyAsync(token);
      request.user = user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // 3️⃣ Role check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [handler, cls]);
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Role ${user.role} not allowed`);
    }

    // 4️⃣ Ability check
    const requiredAbilities = this.reflector.getAllAndOverride<string[]>(ABILITIES_KEY, [handler, cls]);
    if (requiredAbilities?.length) {
      const roleAbilities = ROLE_ABILITIES[user.role] ?? [];

      // a) Check if abilities are allowed for role
      const invalidAbilities = requiredAbilities.filter(a => !roleAbilities.includes(a));
      if (invalidAbilities.length) {
        throw new ForbiddenException(`Abilities not allowed for role ${user.role}: ${invalidAbilities.join(', ')}`);
      }

      // b) Check if user actually has abilities
      const userAbilities = user.abilities ?? [];
      const hasAll = requiredAbilities.every(a => userAbilities.includes(a));
      if (!hasAll) {
        throw new ForbiddenException('User missing required abilities');
      }
    }

    return true;
  }

  /**
   * @description Extracts the Bearer token from the Authorization header.
   * @param request
   * @returns 
   */
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
