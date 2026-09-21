import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

// #region imports
import { DatabaseModule } from '@/core/database/database.module'
import { AuthModule } from '@/core/auth/auth.module'
import { UserModule } from '@/modules/user/user.module'
// #endregion

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), DatabaseModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
