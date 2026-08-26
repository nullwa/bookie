import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
/* #region imports */
// models
import { UserModel } from '@/modules/user/models/user.model'
import { IdentityModel } from '@/modules/user/models/identity.model'
// services
import { UserService } from '@/modules/user/services/user.service'
import { IdentityService } from '@/modules/user/services/identity.service'
/* endregion */

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, IdentityModel])],
  controllers: [],
  providers: [IdentityService, UserService],
  exports: [IdentityService],
})
export class UserModule {}
