import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

/**
 * @description Services inside the application
 */
import { DatabaseModule } from '@/_app/database/database.module'
import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
