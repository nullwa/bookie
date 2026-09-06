import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

class AuthRegisterDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string

  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string

  // The role must be one of the values defined in the eUserRole enum.
  @IsEnum(Enum.User.Role)
  role: Typed.User.Role = Enum.User.Role.GUEST
}
export { AuthRegisterDto }
