import { ConflictException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { StringValue } from 'ms'

// #region imports
import { UserService } from '@/modules/user/user.service'
import { UserModel } from '@/modules/user/models/user.model'
import { AuthRegisterDto } from '@/core/auth/dto/auth-register.dto'
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
    // verify user exists
    const isUserExists = await this._userService.isUserExists(payload.email)
    if (isUserExists) throw new ConflictException('user already exists')

    const user = await this._userService.create({ ...payload })
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
