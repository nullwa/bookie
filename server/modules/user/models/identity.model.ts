import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { hash } from 'bcrypt'

import { Enum } from '@/common/enums'
import { Constants } from '@/common/constants'
import { UserModel } from '@/modules/user/models/user.model'

@Entity('table-identity')
@Index('idx-identity-provider-identifier', ['provider', 'identifier'], { unique: true })
export class IdentityModel {
  @PrimaryGeneratedColumn({ name: 'i-uid' })
  id: number

  @Column({ name: 'i-provider', type: 'enum', enum: typeof Enum.Auth.Provider, default: Enum.Auth.Provider.LOCAL })
  provider: typeof Enum.Auth.Provider

  @Column({ name: 'i-identifier', unique: true })
  identifier: string

  @Column({ name: 'i-password', nullable: true, select: false })
  password: string

  @ManyToOne(() => UserModel, (user) => user.identities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'i-user-uid' })
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
    if (this.password) this.password = await hash(this.password, Constants.Auth.SALT)
  }
}
