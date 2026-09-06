import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'

// #region imports
import { jwtConfig } from '@/core/config/jwt.config'
import { AuthService } from '@/core/auth/auth.service'
import { AuthController } from '@/core/auth/auth.controller'
import { AuthGoogleStrategy } from '@/common/strategies/auth-google.strategy'
import { AuthJwtStrategy } from '@/common/strategies/auth-jwt.strategy'
import { AuthJwtGuard } from '@/common/guards/auth-jwt.guard'
import { UserModule } from '@/modules/user/user.module'
// #endregion

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
      global: true,
    }),
  ],
  providers: [
    AuthService,
    // ── Passport Strategies ──────────────────────────────────────────────────
    // Each strategy registers itself under its name ('jwt', 'google', 'phone')
    // and is triggered by the corresponding AuthGuard.
    // Triggered by JwtAuthGuard (global) on every protected route
    AuthJwtStrategy,
    // Triggered by GoogleAuthGuard on /auth/google/callback
    AuthGoogleStrategy,
    // ── Global Guard ─────────────────────────────────────────────────────────
    // Registers JwtAuthGuard as the application-wide guard.
    // All routes are protected by default — use @Public() to opt out.
    { provide: APP_GUARD, useClass: AuthJwtGuard },
  ],
  controllers: [AuthController],
})
class AuthModule {}
export { AuthModule }
