import { IsEmail, IsString, MinLength } from 'class-validator'

// DTO for returning the JWT token after successful authentication
export class AuthTokenDto {
  /**
   * @description DTO: The JWT token returned after successful authentication.
   */
  @IsString()
  token: string
}

// DtO for sending frogot password email
export class AuthForgotPasswordDto {
  /**
   * @description DTO: the email that will recieve the reset password link.
   */
  @IsEmail()
  email: string
}

// DTO for resetting password using a token
export class AuthResetPasswordDto {
  /**
   * @description DTO: the id of the user associated with the JWT token. This is used to identify the user for whom the password reset is being performed.
   */
  sub: number

  /**
   * @description DTO: The new password must be at least 8 characters long.
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}
