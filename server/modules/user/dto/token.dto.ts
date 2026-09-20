import { IsDate, IsEnum, IsString } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

export class TokenCreateDto {
  @IsEnum(Enum.Auth.Purpose, { message: 'Invalid token purpose' })
  type: Typed.Auth.Purpose

  @IsString()
  token: string

  @IsDate({ message: 'Invalid date format for expiresAt' })
  expiresAt: Date
}
