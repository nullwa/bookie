import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'

import { faker } from '@faker-js/faker'
import { ApiProperty } from '@nestjs/swagger'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

export class UserCreateDto {
  @ApiProperty({ example: faker.internet.email() })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @ApiProperty({ example: faker.internet.password({ length: 8 }) })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional()
  password: string

  @IsOptional()
  @IsString({ message: 'Google ID must be a string' })
  googleId: string

  @ApiProperty({ example: faker.person.firstName() })
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @ApiProperty({ example: faker.person.lastName() })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  @ApiProperty({ example: faker.string.numeric(8) })
  @IsNotEmpty({ message: 'CIN must not be empty' })
  @Max(99999999, { message: 'CIN must be a valid number with a maximum of 8 digits' })
  @Min(10000000, { message: 'CIN must be a valid number with a minimum of 8 digits' })
  @IsOptional()
  cin: number

  @ApiProperty({ example: faker.image.avatar() })
  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar: string

  // The role must be one of the values defined in the eUserRole enum.
  @ApiProperty({ enum: Enum.User.Role })
  @IsEnum(Enum.User.Role, { message: 'Role must be a valid role' })
  role: Typed.User.Role = Enum.User.Role.GUEST

  @ApiProperty({ enum: Enum.User.Ability, isArray: true })
  @IsArray()
  @IsOptional()
  @IsEnum(Enum.User.Ability, { each: true, message: 'this ability is not valid' })
  abilities: Typed.User.Ability[]
}
