import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// #region imports
import { UserModel } from '@/modules/user/models/user.model'
import { TokenModel } from '@/modules/user/models/token.model'

import { UserService } from '@/modules/user/user.service'
import { UserController } from '@/modules/user/user.controller'
// #endregion

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, TokenModel])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}
export { UserModule }
