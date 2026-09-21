import { SetMetadata } from '@nestjs/common'

/**
 * @Roles(...roles)
 *
 * Restricts a route to users whose role matches one of the provided values.
 * Evaluated by JwtAuthGuard after JWT verification.
 *
 * @param roles - One or more allowed role strings (e.g. 'admin', 'manager')
 *
 * @example
 * @Roles('admin', 'manager')
 * @Get('reports')
 * getReports() { ... }
 */
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Typed.User.Role[]) => SetMetadata(ROLES_KEY, roles)
