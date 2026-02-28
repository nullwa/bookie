import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'

import { AuthService } from '@/auth/service/auth.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthForgotPasswordDto } from '@/auth/dto/auth-token.dto'

import { Public } from '@/_app/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) { }

  /**
   * @description return the user associated with the JWT token
   * @param request
   * @returns The user object associated with the JWT token. 
   */
  @Get()
  me(@Req() request: Request & { user: { sub: number, email: string, role: string, abilities: string[], iat: number, exp: number } }) {
    return request.user;
  }

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
   * @description send a forgot notification to the requesting email
   * @param authForgotPasswordDto
   * @returns the notification has been sent or not
   */
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() authForgotPasswordDto: AuthForgotPasswordDto) {
    return this._authService.forgotPassword(authForgotPasswordDto);
  }
}
