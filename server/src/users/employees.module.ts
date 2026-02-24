import { Module } from "@nestjs/common";
import { Employee } from "./entity/employees.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeService } from "./service/employee.service";
import { EmployeesController } from "./controller/employees.controller";
import { UsersModule } from "./users.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    UsersModule,
  ],
  providers: [EmployeeService],
  controllers: [EmployeesController],
})
export class EmployeeModule {}