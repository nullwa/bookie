import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { hash, compare } from 'bcrypt'

// #region imports
import { Enum } from '@/common/enums'
import { Constants } from '@/common/constants'
import { uniqueArrayTransformer } from '@/common/helpers'

import { TokenModel } from '@/modules/user/models/token.model'
// #endregion

@Entity('table-usr-user')
class UserModel {
  // #region Properties
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  @Column({ name: 'tuu-email', unique: true })
  email: string

  @Column({ name: 'tuu-google-id', unique: true, nullable: true })
  googleId: string

  @Column({ name: 'tuu-password', nullable: true, select: false })
  password: string

  @Column({ name: 'tuu-is-verified', default: false })
  isVerified: boolean

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
  //#endregion

  // #region relations
  @OneToMany(() => TokenModel, (token) => token.user, { cascade: true })
  tokens: TokenModel[]
  // #endregion

  //#region methods
  /**
   * @description Hashes the user's password before inserting or updating the user entity in the database
   * This method is decorated with @BeforeInsert and @BeforeUpdate to ensure that the password is always hashed before being stored in the database
   * @returns {void} A promise that resolves when the password has been hashed and updated in the user entity
   */
  @BeforeInsert()
  @BeforeUpdate()
  public hashPassword = async (): Promise<void> => {
    if (this.password) this.password = await hash(this.password, Constants.AUTH_SALT)
  }

  /**
   * @description Assigns abilities to the user based on their role before inserting the user entity in the database
   * This method is decorated with @BeforeInsert to ensure that the abilities are always assigned based on the user's role before being stored in the database
   * @returns {void} A promise that resolves when the abilities have been assigned to the user entity
   */
  @BeforeInsert()
  public assignAbilitiesByRole = (): void => {
    this.abilities = Constants.ROLE_ABILITIES[this.role]
  }

  /**
   * @description Adds an ability to the user
   * @param {Typed.User.Ability} ability The ability to add
   * @returns {boolean} A promise that resolves to true if the ability was added, false otherwise
   */
  public addAbility = (ability: Typed.User.Ability): boolean => {
    if (!this.abilities) this.abilities = []
    if (this.abilities.includes(ability)) return false
    this.abilities.push(ability)
    return true
  }

  /**
   * @description Removes an ability from the user
   * @param {Typed.User.Ability} ability The ability to remove
   * @returns {boolean} A promise that resolves to true if the ability was removed, false otherwise
   */
  public removeAbility = (ability: Typed.User.Ability): boolean => {
    if (!this.abilities || !this.abilities.includes(ability)) return false
    this.abilities = this.abilities.filter((a) => a !== ability)
    return true
  }

  /**
   * @description Compares the provided password with the user's hashed password
   * @param {string} password The password to compare
   * @returns {boolean} A promise that resolves to true if the passwords match, false otherwise
   */
  public comparePassword = async (password: string): Promise<boolean> => {
    if (!this.password) return false
    return await compare(password, this.password)
  }
  //#endregion
}
export { UserModel }
