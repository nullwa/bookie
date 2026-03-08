import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator'
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  /**
   * @description DTO: The role must be one of the values defined in the eUserRole enum.
   */
  @IsEnum(eUserRole)
  role: eUserRole = eUserRole.GUEST
}
