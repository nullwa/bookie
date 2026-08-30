import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// #region imports
import { IdentityModel } from '@/modules/identity/models/identity.model'
import { IdentityService } from '@/modules/identity/identity.service'
// #endregion

@Module({
  imports: [TypeOrmModule.forFeature([IdentityModel])],
  providers: [IdentityService],
  controllers: [],
  exports: [IdentityService],
})
class IdentityModule {}
export { IdentityModule }
