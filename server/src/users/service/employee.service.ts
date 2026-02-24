import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "../entity/employees.entity";
import { Repository } from "typeorm";
import { EmployeeCreateDto } from "../dto/employee.dto";

@Injectable()
export class EmployeeService {
  constructor(@InjectRepository(Employee) private employeeRepository: Repository<Employee>) { }

public create(employeeCreateDto: EmployeeCreateDto): Promise<Employee> {
  const employee = this.employeeRepository.create(employeeCreateDto);
  return this.employeeRepository.save(employee);
}

public findAll(): Promise<Employee[]> {
  return this.employeeRepository.find();

}

public findOne(id: number): Promise<Employee> {
  return this.employeeRepository.findOneBy({ id });
}

public async update(id: number, employeeUpdateDto: EmployeeUpdateDto): Promise<Employee> {
  const employee = await this.employeeRepository.findOneBy({ id });
  if (!employee) {
    throw new NotFoundException(`Employee with id ${id} not found`);
  }
  Object.assign(employee, employeeUpdateDto);
  return this.employeeRepository.save(employee);
}
public async remove(id: number): Promise<void> {
  const employee = await this.employeeRepository.findOneBy({ id });
  if (!employee) {
    throw new NotFoundException(`Employee with id ${id} not found`);
  } await this.employeeRepository.remove(employee);    
}

public findByCode(employeeCode: string): Promise<Employee> {
  return this.employeeRepository.findOneBy({ employeeCode }); 
}
}