import { IsEmail, IsEnum, IsString, IsNotEmpty, MinLength } from 'class-validator'

import { faker } from '@faker-js/faker'
import { ApiProperty } from '@nestjs/swagger'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

export class AuthLoginDto {
  @ApiProperty({ example: faker.internet.email() })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @ApiProperty({ example: faker.internet.password({ length: 8 }) })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}

export class AuthRegisterDto {
  @ApiProperty({ example: faker.internet.email() })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @ApiProperty({ example: faker.internet.password({ length: 8 }) })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @ApiProperty({ example: faker.person.firstName() })
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @ApiProperty({ example: faker.person.lastName() })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  // The role must be one of the values defined in the eUserRole enum.
  @ApiProperty({ enum: Enum.User.Role })
  @IsEnum(Enum.User.Role)
  role: Omit<Typed.User.Role, 'super'> = Enum.User.Role.GUEST
}

export class AuthRefreshTokenDto {
  @ApiProperty({ name: 'refresh-token', description: 'Refresh token used to obtain a new access token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
