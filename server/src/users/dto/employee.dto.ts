import { IsDate, IsEnum, IsNotEmpty } from "class-validator";

export class CreateEmployeeDto{

@IsNotEmpty({ message: 'Employee code must not be empty' })
employeeCode: string;


@IsNotEmpty({ message: 'Speciality must not be empty' })
speciality: string;

@IsEnum(['active', 'inactive', 'suspended'], { message: 'Status must be either active, inactive or suspended' })
status: string;

@IsNotEmpty({ message: 'Phone number must not be empty' })
phoneNumber: string;

@IsNotEmpty({ message: 'Position must not be empty' })
position: string;

@IsDate({ message: 'Hire date must be a valid date' })
hireDate: Date;

}