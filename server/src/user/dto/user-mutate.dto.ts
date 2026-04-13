import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsArray, IsString, IsDate, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { eGenderRole, eUserRole } from '@/_app/constants/enum'
import { eUserAbility } from '@/_app/constants/enum'

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
   * @description DTO: The phone number must not be empty and must be at least 8 characters long.
   */
  @IsNotEmpty({ message: 'Phone number must not be empty' })
  @MinLength(8, { message: 'Phone number must be at least 8 characters long' })
  phone: string

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

  /**
   * @description DTO: The abilities of the user, which is a many-to-many relationship with the Ability entity
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeDto)
  employee?: Partial<EmployeeDto>

  /**
   * @description DTO: The customer information of the user, which is a one-to-one relationship with the Customer entity
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: Partial<CustomerDto>
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

// DTO: The EmployeeDto class defines the structure and validation rules for creating a new employee, which is a nested object within the UserCreateDto.
class EmployeeDto {
  /**
   * @description DTO: The employee code must not be empty and must be a string.
   */
  @IsNotEmpty({ message: 'Employee code must not be empty' })
  @IsString({ message: 'Employee code must be a string' })
  code: string

  /**
   * @description DTO: The position of the employee, which is a boolean indicating whether the employee holds a position or not. It is optional and defaults to false.
   */
  @IsOptional()
  isManager: boolean = false

  /**
   * @description DTO: The job title of the employee, which must not be empty and must be a string. It is optional and can be null if not provided.
   */
  @IsNotEmpty({ message: 'Job title must not be empty' })
  @IsString({ message: 'Job title must be a string' })
  jobTitle: string

  /**
   * @description DTO: The status of the employee, which is a boolean indicating whether the employee is active or not. It is optional and defaults to true.
   */
  @IsOptional()
  isActive: boolean

  /**
   * @description DTO: The hire date must be a valid date. It is optional and defaults to the current date if not provided.
   */
  @IsDate({ message: 'Hire date must be a valid date' })
  hireDate: Date

  /**
   * @description DTO: The end date must be a valid date. It is optional and defaults to the current date if not provided.
   */
  @IsDate({ message: 'End date must be a valid date' })
  endDate: Date
}

// DTO: The CustomerDto class defines the structure and validation rules for creating a new customer, which is a nested object within the UserCreateDto.
class CustomerDto {
  /**
   * @description DTO: The birthday of the customer must be a valid date. It is optional.
   */
  @IsOptional()
  @IsDate({ message: 'Birthday must be a valid date' })
  birthday: Date

  /**
   * @description
   * The gender of the customer must be an array of valid eGenderRole values. It is optional.
   */
  @IsOptional()
  @IsEnum(eGenderRole, { each: true, message: 'this gender is not valid' })
  gender: eGenderRole

  /**
   * @description DTO: The address of the customer must be a string. It is optional.
   */
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address: string

  /**
   * @description DTO: The VIP status of the customer must be a boolean value. It is optional and defaults to false.
   */
  @IsOptional()
  isVip: boolean = false
}
