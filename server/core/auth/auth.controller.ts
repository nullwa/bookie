import { Body, Controller, Post } from '@nestjs/common'

// #region #imports
import { AuthService } from './auth.service'
import { Public } from '@/core/decorators/public.decorator'
import { AuthRegisterDto, AuthLoginDto } from '@/core/auth/dto/auth.dto'
// #endregion

@Controller('auth')
class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() authRegisterDTO: AuthRegisterDto) {
    return this._authService.register(authRegisterDTO)
  }

  @Public()
  @Post('login')
  login(@Body() authLoginDTO: AuthLoginDto) {
    return this._authService.login(authLoginDTO)
  }
}
export { AuthController }
