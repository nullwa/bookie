import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

// #region imports
import { Enum } from '@/common/enums'

import { UserModel } from '@/modules/user/models/user.model'
// #endregion

@Entity('table-usr-token')
@Index('ix_tut_token_type_user', ['token', 'type', 'user'], { unique: true })
class TokenModel {
  // #region Properties
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  @Column({ name: 'tut-purpose', type: 'enum', enum: Enum.Auth.Purpose, default: Enum.Auth.Purpose.ACCESS })
  type: Typed.Auth.Purpose

  @Column({ name: 'tut-token', type: 'varchar', length: 512 })
  token: string

  @Column({ name: 'tut-expires-at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date
  // #endregion

  // #region relations
  @ManyToOne(() => UserModel, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tut-tuu-uid' })
  user: UserModel
  // #endregion
}
export { TokenModel }
