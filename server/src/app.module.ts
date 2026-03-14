import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

/**
 * @description Services inside the application
 */
import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/user/user.module'
import { MailModule } from '@/_app/mail/mail.module'
import { DatabaseModule } from '@/_app/database/database.module'
import { BusinessModule } from './business/business.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), DatabaseModule, UsersModule, AuthModule, MailModule, BusinessModule],
  controllers: [],
})
export class AppModule {}
