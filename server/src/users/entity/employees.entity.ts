import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';
@Entity({name: 'dto-employees'}) 
export class Employee{
 
  @Column({name: 'e-code' })
  code: string

  // true if owner else is staff 
  @Column({name:'e-position'})
  position: boolean

  @Column({name:'e-phone-number'})
  phoneNumber: string

  @Column({name:'e-hire-date'})
  hireDate: Date


  @OneToOne(() => User, (user) => user.employee)
  user: User;
  
  
}

