/**
 * @description The number of salt rounds to use when hashing passwords with bcrypt.
 * A higher number means more security but also more time to hash and verify passwords.
 * The default value is 10, but you can adjust it based on your security requirements and performance needs.
 */
export const SALT_ROUND = 12

/**
 * @description The secret key used for signing JWT tokens. 
 * It should be a long, random string to ensure the security of the tokens.
 */
export const JWT_SECRET = process.env.AUTH_JWT_SECRET

/**
 * @description The expiration time for JWT tokens in seconds.
 * This value determines how long a token is valid before it expires and the user needs to log in again.
 * A common value is 3600 seconds (1 hour), but you can adjust it based on your application's needs.
 */
export const JWT_EXPIRATION = parseInt(process.env.AUTH_JWT_EXPIRATION || '0')