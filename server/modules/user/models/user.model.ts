import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

// #region imports
import { Enum } from '@/common/enums'
import { Constants } from '@/common/constants'
import { uniqueArrayTransformer } from '@/common/helpers'
import { IdentityModel } from '@/modules/identity/models/identity.model'
// #endregion

@Entity('table-usr-user')
class UserModel {
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  @Column({ name: 'tuu-first-name' })
  firstName: string

  @Column({ name: 'tuu-last-name' })
  lastName: string

  @Column({ name: 'tuu-cin', nullable: false, unique: true })
  cin: number

  @Column({ name: 'tuu-avatar', nullable: true })
  avatar: string

  @Column({ name: 'tuu-role', type: 'enum', enum: Enum.User.Role, default: Enum.User.Role.GUEST })
  role: Typed.User.Role

  @Column({ name: 'tuu-abilities', type: 'simple-array', nullable: true, transformer: uniqueArrayTransformer() })
  abilities: Typed.User.Ability[]

  @OneToMany(() => IdentityModel, (identity) => identity.user)
  identities: IdentityModel[]

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
