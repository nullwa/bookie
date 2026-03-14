import { SetMetadata } from '@nestjs/common'

/**
 * @Abilities(...abilities)
 *
 * Restricts a route to users who:
 *  1. Have a role that permits the listed abilities (role-level gate)
 *  2. Have explicitly been granted each listed ability (user-level gate)
 *
 * @param abilities - One or more required ability strings (e.g. 'reports:read')
 *
 * @example
 * @Abilities('reports:read', 'reports:export')
 * @Get('reports/export')
 * exportReports() { ... }
 */
export const ABILITIES_KEY = 'abilities'
export const Abilities = (...abilities: string[]) => SetMetadata(ABILITIES_KEY, abilities)
