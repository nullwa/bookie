// auth.d.ts (runtime file)
import * as Auth from '@/common/enums/auth.enum'
import type { Request } from 'express'

export namespace auth {
  type Purpose = Auth.Purpose

  type Token = {
    accessToken: string
    refreshToken: string
  }

  type Profile = {
    sub: number
    email: string
    role: Typed.User.Role
    abilities: Typed.User.Ability[]
    purpose: Purpose
    iat?: number
    exp?: number
  }

  type AuthenticationRequest = Request & { user: Profile }

  type GoogleProfile = {
    googleId: string
    email: string | null
    isEmailVerified: boolean
    displayName: string
    avatarUrl: string | null
  }
}
