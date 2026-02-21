import { Body, Controller, Get, Post } from '@nestjs/common'

import { AuthService } from '@/auth/service/auth.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthTokenDto } from '@/auth/dto/auth-token.dto'

import { Public } from '@/_app/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) { }

  /**
   * @description authenticate a user and return a JWT token
   * @param authLoginDto
   * @returns The JWT token for the authenticated user.
   */
  @Public()
  @Post('login')
  login(@Body() authLoginDto: AuthLoginDto) {
    return this._authService.login(authLoginDto)
  }

  /**
   * @description authenticate a user and return a JWT token
   * @param authRegisterDto
   * @returns The JWT token for the registered user.
   */
  @Public()
  @Post('register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    return this._authService.register(authRegisterDto)
  }

  /**
   * @description return the user associated with the JWT token
   * @param authTokenDto 
   * @returns The user object associated with the JWT token.
   */
  @Get()
  me(@Body() authTokenDto: AuthTokenDto) {
    return this._authService.me(authTokenDto)
  }
}
