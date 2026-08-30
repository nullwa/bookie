import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// #region imports
import { UserModel } from '@/modules/user/models/user.model'
import { UserService } from '@/modules/user/user.service'
import { UserController } from '@/modules/user/user.controller'
// #endregion

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
class UserModule {}
export { UserModule }
