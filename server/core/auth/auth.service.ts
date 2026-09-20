import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { StringValue } from 'ms'

// #region imports
import { UserService } from '@/modules/user/user.service'
import { UserModel } from '@/modules/user/models/user.model'
// dto
import { AuthRegisterDto } from '@/core/auth/dto/auth-register.dto'
import { AuthLoginDto } from '@/core/auth/dto/auth-login.dto'
// enums
import { Enum } from '@/common/enums'
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
    return this.generateToken(user, Enum.Auth.Purpose.ACCESS)
  }

  public login = async (payload: AuthLoginDto): Promise<Typed.Auth.Token> => {
    const user: UserModel | null = await this._userService.findByEmailWithPassword(payload.email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isPasswordValid: boolean = await user.ComparePassword(payload.password)
    if (!isPasswordValid) throw new UnauthorizedException('Password incorrect')
    return this.generateToken(user, Enum.Auth.Purpose.ACCESS)
  }

  private generateToken = (user: UserModel, purpose: Typed.Auth.Purpose): Typed.Auth.Token => {
    const payload: Typed.Auth.Profile = { sub: user.uid, email: user.email, role: user.role, abilities: user.abilities, purpose: purpose }
    return {
      accessToken: this._jwtService.sign(payload, {
        secret: this._configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this._configService.getOrThrow<StringValue>('JWT_EXPIRE', '2h'),
      }),
      refreshToken: this._jwtService.sign(payload, {
        secret: this._configService.getOrThrow<string>('JWT_SECRET_REFRESH'),
        expiresIn: this._configService.getOrThrow<StringValue>('JWT_EXPIRE_REFRESH', '1d'),
      }),
    }
  }
}
export { AuthService }
