import { ConfigService } from '@nestjs/config'

/**
 * @description The number of salt rounds to use when hashing passwords with bcrypt.
 * A higher number means more security but also more time to hash and verify passwords.
 * The default value is 10, but you can adjust it based on your security requirements and performance needs.
 */
export const SALT_ROUND = 12
