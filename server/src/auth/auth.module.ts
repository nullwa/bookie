import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { StringValue } from 'ms'

import { UsersModule } from '@/users/users.module'

import { AuthService } from '@/auth/service/auth.service'
import { AuthController } from '@/auth/controller/auth.controller'

@Module({
  imports: [UsersModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    global: true,
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('AUTH_JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<StringValue>('AUTH_JWT_EXPIRATION', '1d'),
      },
    }),
  })],
  providers: [AuthService],
  controllers: [AuthController]
})

export class AuthModule {
}

