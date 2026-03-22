import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator'

// DTO for returning the JWT token after successful authentication
export class AuthTokenDto {
  /**
   * @description DTO: The JWT token returned after successful authentication.
   */
  @IsString()
  token: string

  /**
   * @description DTO: The JWT refresh token returned after successful authentication.
   */
  @IsString()
  refreshtoken: string
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
  @IsOptional()
  sub: number

  /**
   * @description DTO: The new password must be at least 8 characters long.
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'Password must contain at least one letter and one number' })
  password: string
}

// DTO for refreshing the authentication token
export class AuthRefreshTokenDto {
  /**
   * @description DTO: The JWT refresh token returned after successful authentication.
   */
  @IsString()
  refreshtoken: string
}
