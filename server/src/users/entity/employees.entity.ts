import { Column, ChildEntity } from 'typeorm';
import { User } from './user.entity';


@ChildEntity({name: 'dto-employees'}) 
export class Employee extends User{

  @Column({name: 'employee-code' })
  employeeCode: string;

  @Column({name:'position'})
  position: string;

  @Column({name:'Speciality'})
  speciality: string;

  @Column({name:'phone-number'})
  phoneNumber: string;

  @Column({name:'hire-date'})
  hireDate: Date;

  @Column({name: 'status'})
  status: string;

  @OneToOne(() => User, (user) => user.employee)
  user: User;
  
  
}

