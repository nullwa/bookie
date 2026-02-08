import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

/**
 * @description Services inside the application
 */
import { AuthGuard } from '@/_app/guards/auth-guard.guard'
import { DatabaseModule } from '@/_app/database/database.module'
import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard }
  ]
})
export class AppModule {
}
