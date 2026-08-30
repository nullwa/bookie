import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

// #region imports
import { IdentityModel } from '@/modules/identity/models/identity.model'
import { Enum } from '@/common/enums'
import { uniqueArrayTransformer } from '@/common/helpers'
// #endregion

@Entity('table-usr-user')
class UserModel {
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  @Column({ name: 'tuu-role', type: 'enum', enum: Enum.User.Role, default: Enum.User.Role.GUEST })
  role: Typed.User.Role

  @Column({ name: 'tuu-abilities', type: 'simple-array', nullable: true, transformer: uniqueArrayTransformer() })
  abilities: Typed.User.Ability[]

  @OneToMany(() => IdentityModel, (identity) => identity.user)
  identities: IdentityModel[]
}
export { UserModel }
