import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsArray, IsString, IsDate } from 'class-validator'

import { eUserRole } from '@/_app/constants/enum'
import { eUserAbility } from '@/_app/constants/enum';

// DTO: The UserCreateDto class defines the structure and validation rules for creating a new user.
export class UserCreateDto {
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

  @IsOptional()
  employee?: Partial<EmployeeCreateDto>
}

// DTO: The UserUpdateDto class extends the UserCreateDto class, making all properties optional for update operations.
export class UserUpdateDto extends PartialType(UserCreateDto) {
  /**
    * @description DTO: The abilities of the user, which is a many-to-many relationship with the Ability entity
    */
  @IsArray()
  @IsOptional()
  @IsEnum(eUserAbility, { each: true, message: 'this ability is not valid' })
  abilities: eUserAbility[]
}

class EmployeeCreateDto {

  @IsNotEmpty({ message: 'Employee code must not be empty' })
  @IsString({ message: 'Employee code must be a string' })
  code: string

  @IsNotEmpty({ message: 'Phone number must not be empty' })
  @MinLength(8, { message: 'Phone number must be at least 8 characters long' })
  phoneNumber: string

  @IsOptional()
  position: boolean= false

  @IsDate({ message: 'Hire date must be a valid date' })
  hireDate: Date
}
