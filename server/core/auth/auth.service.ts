import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { StringValue } from 'ms'

// #region imports
import { Enum } from '@/common/enums'
import { getExpiryDate } from '@/common/helpers'
import { UserService } from '@/modules/user/user.service'
import { UserModel } from '@/modules/user/models/user.model'

import { AuthRegisterDto, AuthLoginDto } from '@/core/auth/dto/auth.dto'
// #endregion

@Injectable()
class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _userService: UserService
  ) {}

  public register = async (payload: AuthRegisterDto): Promise<Typed.Auth.Token> => {
    const user: UserModel = await this._userService.create({ ...payload })
    return this.issueTokens(user)
  }

  public login = async (payload: AuthLoginDto): Promise<Typed.Auth.Token> => {
    const user: UserModel | null = await this._userService.findByEmailWithPassword(payload.email)
    const isPasswordValid: boolean = user ? await user.comparePassword(payload.password) : false
    if (!user || !isPasswordValid) throw new UnauthorizedException('Invalid credentials')
    return this.issueTokens(user)
  }

  public refresh = async (refreshToken: string): Promise<Typed.Auth.Token> => {
    const stored = await this._userService.findValidToken(refreshToken, Enum.Auth.Purpose.REFRESH)
    if (!stored) throw new UnauthorizedException('Invalid or expired refresh token')

    await this._userService.deleteToken(refreshToken, Enum.Auth.Purpose.REFRESH)
    return this.issueTokens(stored.user)
  }

  public logout = async (refreshToken: string): Promise<void> => {
    await this._userService.deleteToken(refreshToken, Enum.Auth.Purpose.REFRESH)
  }

  // #region generating tokens
  private issueTokens = async (user: UserModel): Promise<Typed.Auth.Token> => {
    const accessExpire = this._configService.getOrThrow<StringValue>('JWT_EXPIRE', '2h')
    const refreshExpire = this._configService.getOrThrow<StringValue>('JWT_EXPIRE_REFRESH', '1d')

    const accessToken = this.generateToken(user, Enum.Auth.Purpose.ACCESS, accessExpire)
    const refreshToken = this.generateToken(user, Enum.Auth.Purpose.REFRESH, refreshExpire)

    await this._userService.addAuthenticationToken({ token: refreshToken, type: Enum.Auth.Purpose.REFRESH, expiresAt: getExpiryDate(refreshExpire) }, user)

    return { accessToken, refreshToken }
  }

  private generateToken = (user: UserModel, purpose: Typed.Auth.Purpose, expiresIn: StringValue): string => {
    const payload: Typed.Auth.Profile = { sub: user.uid, email: user.email, role: user.role, abilities: user.abilities, purpose: purpose }
    const secret = purpose === Enum.Auth.Purpose.REFRESH ? this._configService.getOrThrow<string>('JWT_SECRET_REFRESH') : this._configService.getOrThrow<string>('JWT_SECRET')
    return this._jwtService.sign(payload, { secret, expiresIn })
  }
  // #endregion
}
export { AuthService }
