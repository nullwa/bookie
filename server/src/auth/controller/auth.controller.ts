import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { CreateAuthDto } from '@/auth/dto/login-auth.dto'

@Controller('auth')
export class AuthController {

  constructor(private readonly _authService: AuthService) {
  }

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this._authService.login(createAuthDto)
  }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
  }

  @Get()
  me(@Body createAuthDto: CreateAuthDto) {
  }
}
