import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@/user/entity/user.entity'
import { Employee } from '@/user/entity/employee.entity'
import { UsersService } from '@/user/service/user.service'
import { UsersController } from '@/user/controller/user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
