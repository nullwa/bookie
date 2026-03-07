import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

/**
 * @description Services inside the application
 */
import { AuthGuard } from '@/_app/guards/auth-guard.guard'

import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/users/users.module'
import { MailModule } from '@/_app/mail/mail.module'
import { DatabaseModule } from '@/_app/database/database.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), DatabaseModule, UsersModule, AuthModule, MailModule],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
