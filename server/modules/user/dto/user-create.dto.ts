import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

export class UserCreateDto {
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  @IsNotEmpty({ message: 'CIN must not be empty' })
  @Max(99999999, { message: 'CIN must be a valid number with a maximum of 8 digits' })
  @Min(10000000, { message: 'CIN must be a valid number with a minimum of 8 digits' })
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
