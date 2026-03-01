import { Body, Controller, Get, Post, Patch, Req, Query, UnauthorizedException } from '@nestjs/common'

import { AuthService } from '@/auth/service/auth.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthForgotPasswordDto, AuthResetPasswordDto } from '@/auth/dto/auth-token.dto'

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
  me(@Req() request: Request & { user: { sub: number, email: string, role: string, abilities: string[] } }) {
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
    return this._authService.forgotPassword(authForgotPasswordDto)
  }

  /**
   * @description reset the password for the user associated with the JWT token
   * @param request
   * @param authResetPasswordDto 
   * @returns the password has been reset or not
   * @throws UnauthorizedException if the token is invalid or missing
   */
  @Post('reset-password')
  resetPassword(@Req() request: Request & { user: { sub: number, email: string, type: string } }, @Body() authResetPasswordDto: AuthResetPasswordDto) {
    if (request.user == null || request.user.type !== 'reset-password') {
      throw new UnauthorizedException('Token mismatch: invalid token type or missing token')
    }
    authResetPasswordDto.sub = request.user.sub
    return this._authService.resetPassword(authResetPasswordDto)
  }

  /**
   * @description send a verification email to the requesting email
   * @param email
   */
  @Post('verify-email')
  verifyEmail(@Query('email') email: string) {
    return this._authService.sendVerificationEmail(email)
  }

  /**
   * @description confirm the email for the user associated with the JWT token
   * @param request
   */
  @Patch('confirm-email')
  confirmEmail(@Req() request: Request & { user: { sub: number, email: string, type: string } }) {
    if (request.user == null || request.user.type !== 'verify-email') {
      throw new UnauthorizedException('Token mismatch: invalid token type or missing token')
    }
    return this._authService.confirmVerficationEmail(request.user.sub)
  }
}
