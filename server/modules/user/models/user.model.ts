import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { IdentityModel } from '@/modules/user/models/identity.model'

@Entity('table-user')
export class UserModel {
  @PrimaryGeneratedColumn({ name: 'u-uid' })
  uid: number

  @Column({ name: 'u-last-name' })
  firstName: string

  @Column({ name: 'u-first-name' })
  lastName: string

  @Column({ name: 'u-avatar', nullable: true })
  avatar: string

  @OneToMany(() => IdentityModel, (identity) => identity.user, { onDelete: 'CASCADE' })
  identities: IdentityModel[]
}
