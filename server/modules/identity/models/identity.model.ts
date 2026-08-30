import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { hash } from 'bcrypt'

// #region imports
import { UserModel } from '@/modules/user/models/user.model'
import { Enum } from '@/common/enums'
import { Constants } from '@/common/constants'
// #endregion

@Entity('table-usr-identity')
@Index('idx-identity-provider-identifier', ['provider', 'identifier'], { unique: true })
@Index('idx-identity-identifier-isDefaultAccount', ['identifier', 'isDefaultAccount'], { unique: true })
class IdentityModel {
  @PrimaryGeneratedColumn({ name: 'tui-uid' })
  uid: number

  @Column({ name: 'tui-provider', type: 'enum', enum: Enum.Auth.Provider, default: Enum.Auth.Provider.EMAIL })
  provider: Typed.Auth.Provider

  @Column({ name: 'tui-identifier' })
  identifier: string

  @Column({ name: 'tui-password', nullable: true, select: false })
  password: string

  @Column({ name: 'tui-is-verified' })
  isVerified: boolean

  @Column({ name: 'tui-is-default-account' })
  isDefaultAccount: boolean

  @ManyToOne(() => UserModel, (user) => user.identities, { cascade: ['remove', 'soft-remove'] })
  @JoinColumn({ name: 'tui-user-id' })
  user: UserModel

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
}
export { IdentityModel }
