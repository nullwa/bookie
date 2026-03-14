import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@/user/entity/user.entity'
import { Employee } from '@/user/entity/employee.entity'
import { Customer } from '@/user/entity/customer.entity'
import { UserService } from '@/user/service/user.service'
import { UserController } from '@/user/controller/user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee, Customer])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
