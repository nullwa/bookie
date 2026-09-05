import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
import { IsIdentifierValid } from '@/common/decorators/validaton.decorator'
// #endregion

class RegisterDto {
  @IsEnum(Enum.Auth.Provider)
  provider: Typed.Auth.Provider

  @IsString()
  @IsNotEmpty()
  @IsIdentifierValid({ message: 'identifier does not match the expected format for the given provider' })
  identifier: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @IsEnum(Enum.User.Role)
  role: Typed.User.Role

  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string

  @IsNotEmpty({ message: 'CIN must not be empty' })
  @Max(99999999, { message: 'CIN must be a valid number with a maximum of 8 digits' })
  @Min(10000000, { message: 'CIN must be a valid number with a minimum of 8 digits' })
  cin: number
}
export { RegisterDto }
