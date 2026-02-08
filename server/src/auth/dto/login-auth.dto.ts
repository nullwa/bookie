import { IsEmail, IsString, MinLength } from 'class-validator'
export class LoginAuthDto {
  /**
   * @description The email must be a valid email address.
   * @example "test@mail.co
   */
  @IsEmail()
  email: string

  /**
   * @description The password must be at least 8 characters long.
   * @example "P@ssw0rd"
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
} 
