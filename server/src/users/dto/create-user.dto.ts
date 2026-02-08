import { eUserRole } from '@/_app/constants/enum'
import { IsEmail, IsEnum, IsNotEmpty, MinLength, } from 'class-validator'

export class CreateUserDto {
  /**
   * @description DTO: The first name must not be empty.
   */
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  /**
   * @description DTO: The last name must not be empty.
   */
  @IsNotEmpty({ message: 'Last name must not be empty' })
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
