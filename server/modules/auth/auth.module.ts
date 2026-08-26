import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

/* #region imports */
// modules
import { UserModule } from '@/modules/user/user.module'
import { jwtConfig } from '@/config/jwt.config'
//strategies
import { AuthLocalStrategy } from '@/common/strategies/auth-local.strategy'
import { AuthJwtStrategy } from '@/common/strategies/auth-jwt.strategy'
import { AuthGoogleStrategy } from '@/common/strategies/auth-google.strategy'
import { AuthOtpStrategy } from '@/common/strategies/auth-otp.strategy'
//services
import { AuthService } from '@/modules/auth/services/auth.service'
/* endregion */

@Module({
  imports: [UserModule, PassportModule, JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: jwtConfig })],
  controllers: [],
  providers: [AuthLocalStrategy, AuthJwtStrategy, AuthGoogleStrategy, AuthOtpStrategy, AuthService],
})
export class AuthModule {}
