import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

// #region imports
import { Enum } from '@/common/enums'

import { UserModel } from '@/modules/user/models/user.model'
// #endregion

@Entity('table-usr-token')
@Index('ix_tut_token_type', ['token', 'type'], { unique: true })
class TokenModel {
  // #region Properties
  @PrimaryGeneratedColumn({ name: 'tuu-uid' })
  uid: number

  @Column({ name: 'tut-purpose', type: 'enum', enum: Enum.Auth.Purpose, default: Enum.Auth.Purpose.ACCESS })
  type: Typed.Auth.Purpose

  @Column({ name: 'tut-token' })
  token: string

  @Column({ name: 'tut-expires-at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date
  // #endregion

  // #region relations
  @ManyToOne(() => UserModel, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: UserModel
  // #endregion
}
export { TokenModel }
