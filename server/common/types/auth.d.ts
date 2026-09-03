// auth.d.ts (runtime file)
import * as Auth from '@/common/enums/auth.enum'
import type { Request } from 'express'

export namespace auth {
  type Provider = Auth.Provider
  type Purpose = Auth.Purpose
  type Profile = { sub: number; provider: Provider; identifier: string; purpose: Purpose; role: Typed.User.Role; abilities: Typed.User.Ability[]; iat?: number; exp?: number }
  type AuthenticationRequest = Request & { user: Profile }
  type GoogleProfile = { googleId: string; email: string | null; isEmailVerified: boolean; displayName: string; avatarUrl: string | null }
}
