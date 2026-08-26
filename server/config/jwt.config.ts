import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

import type { StringValue } from 'ms'

export const jwtConfig = (_configService: ConfigService): JwtModuleOptions => {
  return {
    secret: _configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: _configService.getOrThrow<StringValue>('JWT_EXPIRE', '1h'),
    },
  }
}
