import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginAuthDto {
  /**
   * @description DTO: The email must be a valid email address.
   */
  @IsEmail()
  email: string

  /**
   * @description DTO: The password must be at least 8 characters long.
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
} 
