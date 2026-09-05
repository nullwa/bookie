import { ConflictException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

// #region imports
import { UserService } from '@/modules/user/user.service'
import { IdentityService } from '@/modules/identity/identity.service'
import { RegisterDto } from '@/core/auth/dto/register.dto'
// #endregion

@Injectable()
class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly _identityService: IdentityService
  ) {}

  public register = async (registerDto: RegisterDto) => {
    const existingUSer: boolean = await this._identityService.verifyIdentifier(registerDto.identifier)
    if (!existingUSer) throw new ConflictException('User with this email already exists')
  }
}
export { AuthService }
