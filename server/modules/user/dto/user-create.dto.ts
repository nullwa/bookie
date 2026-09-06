import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

export class UserCreateDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional()
  password: string

  @IsOptional()
  @IsString({ message: 'Google ID must be a string' })
  googleId: string

  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  @IsNotEmpty({ message: 'CIN must not be empty' })
  @Max(99999999, { message: 'CIN must be a valid number with a maximum of 8 digits' })
  @Min(10000000, { message: 'CIN must be a valid number with a minimum of 8 digits' })
  @IsOptional()
  cin: number

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar: string

  // The role must be one of the values defined in the eUserRole enum.
  @IsEnum(Enum.User.Role)
  role: Typed.User.Role = Enum.User.Role.GUEST

  @IsArray()
  @IsOptional()
  @IsEnum(Enum.User.Ability, { each: true, message: 'this ability is not valid' })
  abilities: Typed.User.Ability[]
}
