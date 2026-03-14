import { SetMetadata } from '@nestjs/common'

/**
 * @Public()
 *
 * Marks a route as publicly accessible.
 * The global JwtAuthGuard will skip JWT verification, role checks,
 * and ability checks entirely for decorated routes.
 *
 * Use on: login, register, OAuth routes, health checks, public APIs.
 *
 * @example
 * @Public()
 * @Post('login')
 * login(@Body() dto: AuthLoginDto) { ... }
 */
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
