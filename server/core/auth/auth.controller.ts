import { Body, Controller, Post } from '@nestjs/common'

// #region #imports
import { AuthService } from './auth.service'
import { Public } from '@/common/decorators/public.decorator'
import { AuthRegisterDto } from './dto/auth-register.dto'
// #endregion

@Controller('auth')
class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() authRegisterDTO: AuthRegisterDto) {
    return this._authService.register(authRegisterDTO)
  }
}
export { AuthController }
