import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { hash } from 'bcrypt'

// #region imports
import { Enum } from '@/common/enums'
import { Constants } from '@/common/constants'
import { uniqueArrayTransformer } from '@/common/helpers'
// #endregion

@Entity('table-usr-user')
class UserModel {
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  // #region credentials
  @Column({ name: 'tuu-email', unique: true })
  email: string

  @Column({ name: 'tuu-google-id', unique: true, nullable: true })
  googleId: string

  @Column({ name: 'tuu-password', nullable: true, select: false })
  password: string

  @Column({ name: 'tuu-is-verified', default: false })
  isVerified: boolean
  // #endregion

  @Column({ name: 'tuu-first-name' })
  firstName: string

  @Column({ name: 'tuu-last-name' })
  lastName: string

  @Column({ name: 'tuu-cin', nullable: true, unique: true })
  cin: number

  @Column({ name: 'tuu-avatar', nullable: true })
  avatar: string

  @Column({ name: 'tuu-role', type: 'enum', enum: Enum.User.Role, default: Enum.User.Role.GUEST })
  role: Typed.User.Role

  @Column({ name: 'tuu-abilities', type: 'simple-array', nullable: true, transformer: uniqueArrayTransformer() })
  abilities: Typed.User.Ability[]

  /**
   * Hashes the user's password before inserting or updating the user entity in the database
   * This method is decorated with @BeforeInsert and @BeforeUpdate to ensure that the password is always hashed before being stored in the database
   *
   * @returns A promise that resolves when the password has been hashed and updated in the user entity
   */
  @BeforeInsert()
  @BeforeUpdate()
  public hashPassword = async (): Promise<void> => {
    if (this.password) this.password = await hash(this.password, Constants.AUTH_SALT)
  }

  @BeforeInsert()
  public assignAbilitiesByRole = (): void => {
    this.abilities = Constants.ROLE_ABILITIES[this.role]
  }

  public addAbility = (ability: Typed.User.Ability): boolean => {
    if (!this.abilities) this.abilities = []
    if (this.abilities.includes(ability)) return false
    this.abilities.push(ability)
    return true
  }

  public removeAbility = (ability: Typed.User.Ability): boolean => {
    if (!this.abilities || !this.abilities.includes(ability)) return false
    this.abilities = this.abilities.filter((a) => a !== ability)
    return true
  }
}
export { UserModel }
