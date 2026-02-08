import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UsersModule } from '@/users/users.module'

import { AuthService } from '@/auth/service/auth.service'
import { AuthController } from '@/auth/controller/auth.controller'

import { JWT_EXPIRATION, JWT_SECRET } from '@/_app/constants/const'

@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: JWT_EXPIRATION }
  })],
  providers: [AuthService],
  controllers: [AuthController]
})

export class AuthModule {
}

