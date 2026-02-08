import { Body, Controller, Get, Post } from '@nestjs/common'

import { Public } from '@/_app/decorators/public.decorator'
import { AuthService } from '@/auth/service/auth.service'
import { LoginAuthDto } from '@/auth/dto/login-auth.dto'
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto'
import { TokenAuthDto } from '@/auth/dto/token-auth.dto'

@Controller('auth')
export class AuthController {

  constructor(private readonly _authService: AuthService) {
  }

  @Public()
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this._authService.login(loginAuthDto)
  }

  @Public()
  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this._authService.register(registerAuthDto)
  }

  @Get()
  me(@Body() tokenAuthDto: TokenAuthDto) {
    return this._authService.me(tokenAuthDto)
  }
}
