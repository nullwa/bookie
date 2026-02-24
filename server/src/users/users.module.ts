import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/users/entity/user.entity';
import { UsersService } from '@/users/service/users.service';
import { UsersController } from '@/users/controller/users.controller';
import { Employee } from './entity/employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
