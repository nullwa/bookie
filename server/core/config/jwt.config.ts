import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

import { StringValue } from 'ms'

const jwtConfig = (_configService: ConfigService): JwtModuleOptions => ({
  secret: _configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: _configService.getOrThrow<StringValue>('JWT_EXPIRE', '1h'),
  },
})

export { jwtConfig }
