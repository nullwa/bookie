import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty, IsOptional, Matches, IsPhoneNumber } from 'class-validator'
import { eUserRole } from '@/_app/constants/enum'

// DTO for user login
export class AuthLoginDto {
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
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'Password must contain at least one letter and one number' })
  password: string
}

// DTO for user registration
export class AuthRegisterDto {
  /**
   * @description DTO: The first name must not be empty.
   */
  @IsNotEmpty()
  firstName: string

  /**
   * @description DTO: The last name must not be empty.
   */
  @IsNotEmpty()
  lastName: string

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
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'Password must contain at least one letter and one number' })
  password: string

  /**
   * @description DTO: The role must be one of the values defined in the eUserRole enum.
   */
  @IsEnum(eUserRole)
  role: eUserRole = eUserRole.GUEST

  /**
   * @description DTO: The Google ID is an optional string that represents the user's Google account ID.
   */
  @IsOptional()
  @IsString({ message: 'Google ID must be a string' })
  googleId: string

  /**
   * @description DTO: The avatar is an optional string that represents the URL of the user's avatar image.
   */
  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar: string

  @IsOptional()
  @IsPhoneNumber()
  phone: string
}
