import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { StringValue } from 'ms'

import { MailModule } from '@/_app/mail/mail.module'
import { UsersModule } from '@/user/user.module'
import { PassportModule } from '@nestjs/passport'

import { JwtAuthGuard } from '@/_app/guards/jwt.guard'
import { JwtStrategy } from '@/_app/strategies/jwt.strategy'
import { GoogleStrategy } from '@/_app/strategies/google.strategy'
import { AuthService } from '@/auth/service/auth.service'
import { AuthController } from '@/auth/controller/auth.controller'

/**
 * AuthModule
 *
 * Owns all authentication and authorization concerns:
 *  - Email/password login        → AuthService.login()
 *  - Google OAuth login          → GoogleStrategy → AuthService.validateGoogleUser()
 *  - JWT verification            → JwtStrategy → JwtAuthGuard (global)
 *  - Role + ability enforcement  → JwtAuthGuard (@Roles, @Abilities decorators)
 *
 * The JwtAuthGuard is registered as a global APP_GUARD, meaning it runs
 * on every route automatically. Routes that should be public must be
 * decorated with @Public() to opt out.
 *
 * ─── What changed from your original implementation ─────────────────────────
 *
 *  STATE:
 *    - JWT verification delegated to Passport via JwtStrategy + AuthGuard('jwt')
 *    - super.canActivate() in JwtAuthGuard replaces manual verifyAsync()
 *    - PassportModule added
 *    - JwtStrategy + GoogleStrategy registered as providers
 *    - JwtModule global: true kept — JwtService still injectable everywhere
 *    - Everything else (@Roles, @Abilities, @Public) is unchanged
 */
@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule,
    // JWT signing and verification
    // global: true keeps JwtService injectable in other modules if needed
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('AUTH_JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('AUTH_JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    // ── Passport Strategies ──────────────────────────────────────────────────
    // Each strategy registers itself under its name ('jwt', 'google')
    // and is triggered by the corresponding AuthGuard.
    JwtStrategy, // Triggered by JwtAuthGuard (global) on every protected route
    GoogleStrategy, // Triggered by GoogleAuthGuard on /auth/google/callback
    // ── Global Guard ─────────────────────────────────────────────────────────
    // Registers JwtAuthGuard as the application-wide guard.
    // All routes are protected by default — use @Public() to opt out.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
