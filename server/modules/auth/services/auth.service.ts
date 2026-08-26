import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserModel } from '@/modules/user/models/user.model'

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(private readonly _jwtService: JwtService) {}

  // #region tokens
  public issueTokenPair = (user: UserModel): { token: string } => {
    const payload = this._jwtService.sign({ sub: user.uid, purpose: 'access' })
    return { token: payload }
  }

  public issueLinkedToken = (user: UserModel): { token: string } => {
    const payload = this._jwtService.sign({ sub: user.uid, purpose: 'link' })
    return { token: payload }
  }
  // #endregion

  // #region otp
  private store = new Map<string, { code: string; expiresAt: number; attempts: number }>()
  private readonly TTL_MS = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ATTEMPTS = 3

  private generateOtpCode = (phone: string): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    this.store.set(phone, { code, expiresAt: Date.now() + this.TTL_MS, attempts: 0 })
    return code
  }

  private isOtpCodeValid = (phone: string, code: string): boolean => {
    const record = this.store.get(phone)
    if (!record) return false

    if (Date.now() > record.expiresAt) {
      this.store.delete(phone)
      return false
    }

    record.attempts += 1
    if (record.attempts > this.MAX_ATTEMPTS) {
      this.store.delete(phone)
      return false
    }
    const isValid = record.code === code
    if (isValid) this.store.delete(phone)
    return isValid
  }
  //#endregion
}
