import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

// #region imports
import { IdentityService } from '@/modules/identity/identity.service'
// #endregion

@Injectable()
class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _identityService: IdentityService
  ) {}

  public register = () => {}
}
export { AuthService }
