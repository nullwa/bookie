import { Body, Controller, Get, Post, Patch, Req, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '@/user/entity/user.entity'
import { AuthService } from '@/auth/service/auth.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthForgotPasswordDto, AuthRefreshTokenDto, AuthResetPasswordDto } from '@/auth/dto/auth-token.dto'

import { Public } from '@/_app/decorators/public.decorator'
import { GoogleAuthGuard } from '@/_app/guards/google.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  /**
   * @description return the user associated with the JWT token
   *
   * @param request
   * @returns The user object associated with the JWT token.
   */
  @Get()
  me(@Req() request: Request & { user: { sub: number; email: string; role: string; abilities: string[] } }) {
    return request.user
  }

  /**
   * @description authenticate a user and return a JWT token
   *
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
   *
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
   *
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
   *
   * @param request
   * @param authResetPasswordDto
   * @returns the password has been reset or not
   * @throws UnauthorizedException if the token is invalid or missing
   */
  @Post('reset-password')
  resetPassword(@Req() request: Request & { user: { sub: number; email: string; type: string } }, @Body() authResetPasswordDto: AuthResetPasswordDto) {
    if (request.user == null || request.user.type !== 'reset-password') throw new UnauthorizedException('Token mismatch: invalid token type or missing token')
    authResetPasswordDto.sub = request.user.sub
    return this._authService.resetPassword(authResetPasswordDto)
  }

  /**
   * @description send a verification email to the requesting email
   *
   * @param email The email address of the user to whom the verification email will be sent.
   * @return An object containing a message indicating that the verification email has been sent.
   * @throws UnauthorizedException if the token is invalid or missing
   */
  @Post('verify-email')
  verifyEmail(@Query('email') email: string) {
    return this._authService.sendVerificationEmail(email)
  }

  /**
   * @description confirm the email for the user associated with the JWT token
   *
   * @param request The request object containing the user information from the JWT token.
   * @return An object containing a message indicating that the email has been verified.
   * @throws UnauthorizedException if the token is invalid or missing
   */
  @Patch('confirm-email')
  confirmEmail(@Req() request: Request & { user: { sub: number; email: string; type: string } }) {
    if (request.user == null || request.user.type !== 'verify-email') throw new UnauthorizedException('Token mismatch: invalid token type or missing token')
    return this._authService.confirmVerficationEmail(request.user.sub)
  }

  /**
   * @description Refresh token rotation - old token invalidated on each use
   *
   * @param authRefreshTokenDto
   * @returns new token refreshed
   */
  @Public()
  @Post('refresh')
  refresh(@Body() authRefreshTokenDto: AuthRefreshTokenDto) {
    const decoded = this._jwtService.decode(authRefreshTokenDto.refreshtoken)
    if (!decoded?.sub) throw new UnauthorizedException('Invalid refresh token')
    return this._authService.refreshTokens(decoded.sub, authRefreshTokenDto.refreshtoken)
  }

  /**
   * @description logout a user and return a message
   *
   * @param authLoginDto
   * @returns Message indicating that a user no longer authenticated.
   */
  @Post('logout')
  logout(@Req() request: Request & { user: { uid: number } }) {
    return this._authService.logout(request.user.uid)
  }

  /**
   * @description Initiates the Google OAuth flow. This route is protected by the GoogleAuthGuard which triggers the OAuth process.
   * The actual authentication logic is handled in the GoogleStrategy's validate() method, which is called after Google resolves the OAuth code.
   *
   * @returns This route does not return a response directly. The user is redirected to Google's consent screen, and after successful authentication, they are redirected back to the callback URL defined in the GoogleStrategy.
   */
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  LoginWithGoogle() {}

  /**
   * @description This route is the callback URL for Google OAuth. After the user authenticates with Google, they are redirected to this route, which is protected by the GoogleAuthGuard.
   * The guard processes the OAuth response and calls the GoogleStrategy's validate() method to find or create the user in the database.
   * The actual response (e.g., JWT token) is handled within the validate() method of the GoogleStrategy.
   *
   * @returns This route does not return a response directly. The response is handled in the GoogleStrategy's validate() method, which typically involves issuing a JWT token and redirecting the user to the appropriate page in the frontend application.
   */
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() request: Request & { user: User }) {
    const tokens = await this._authService.loginWithGoogle(request.user)
    return {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    }
  }
}
