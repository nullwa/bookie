import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';
@Entity({name: 'dto-employees'}) 
export class Employee{
  /**
    * @description The employee code is a unique identifier for each employee, which can be used to link the employee to a user account. This code is typically generated based on a specific format or pattern defined by the organization, and it helps in managing employee records and their associated user accounts effectively.
    */
  @Column({name: 'e-code' })
  code: string
  
  // true if owner else is staff 
   /**
    * @description The position property indicates whether the employee holds an owner position or a staff position within the organization. This boolean value can be used to differentiate between different levels of access or responsibilities that employees may have, with owners typically having more privileges and control over the system compared to staff members.
    */
  @Column({name:'e-position'})
  position: boolean

   /**
    * @description The phone number property stores the contact number of the employee, which can be used for communication purposes. This information is essential for maintaining contact with employees and can be utilized for various administrative tasks, such as sending notifications or verifying identity. The phone number should be stored in a standardized format to ensure consistency and ease of use across the system.
    */
  @Column({name:'e-phone-number'})
  phoneNumber: string

    /**
     * @description The hire date property records the date when the employee was hired by the organization. This information is crucial for tracking the employee's tenure and can be used for various HR-related purposes, such as calculating benefits, determining eligibility for promotions, or managing payroll. The hire date should be stored in a date format to allow for easy manipulation and comparison within the system.
     */
   @Column({name:'e-hire-date'})
   hireDate: Date

    /**
     * @description The user property establishes a one-to-one relationship between the Employee entity and the User entity. This relationship allows each employee to be associated with a single user account, enabling the system to link employee information with user credentials and permissions. The @OneToOne decorator is used to define this relationship, and the JoinColumn decorator can be used to specify the foreign key column that connects the two entities in the database.
     */
  @OneToOne(() => User, (user) => user.employee)
  user: User
}

