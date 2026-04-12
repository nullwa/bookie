import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { StringValue } from 'ms'
import { compare } from 'bcrypt'

import { User } from '@/user/entity/user.entity'
import { MailService } from '@/_app/mail/mail.service'
import { UserService } from '@/user/service/user.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthResetPasswordDto, AuthForgotPasswordDto } from '@/auth/dto/auth-token.dto'
import e from 'express'
import { eUserRole } from '@/_app/constants/enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _mailService: MailService,
    private readonly _configService: ConfigService,
    private readonly _usersService: UserService,
  ) {}

  /**
   * @description Authenticates a user and returns a JWT token if the credentials are valid.
   *
   * @param authLoginDto
   * @returns An object containing the JWT token.
   * @throws UnauthorizedException if the user is not found or the password is incorrect.
   */
  public login = async (authLoginDto: AuthLoginDto): Promise<{ token: string; refreshToken: string }> => {
    const user = await this._usersService.findByEmail(authLoginDto.email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isValid = await compare(authLoginDto.password, user.password)
    if (!isValid) throw new UnauthorizedException('Invalid credentials')

    return this._issueTokenPair(user)
  }

  /**
   * @description Logout and invalidate the refresh tokens

   * @param uid
   * @returns message
   */
  public logout = async (uid: number): Promise<{ message: string }> => {
    await this._usersService.setRefreshToken(uid, null)
    return { message: 'Logged out successfully.' }
  }

  /**
   * @description Registers a new user using the provided registration data.
   *
   * @param authRegisterDto
   * @returns token
   * @throws UnauthorizedException if the registration fails (e.g., unable to create user).
   */
  public register = async (authRegisterDto: AuthRegisterDto): Promise<{ token: string }> => {
    const user = await this._usersService.create(authRegisterDto)
    if (!user) throw new UnauthorizedException('Registration failed: unable to create user')

    this.sendVerificationEmail(user.email) // fire and forget
    return this._issueTokenPair(user)
  }

  /**
   * @description Initiates the password reset process by sending a password reset email to the user associated with the provided email address.
   *
   * @param authForgotPasswordDto
   * @returns An object containing a message indicating that the password reset email has been sent.
   */
  public forgotPassword = async (authForgotPasswordDto: AuthForgotPasswordDto): Promise<{ message: string }> => {
    const user = await this._usersService.findByEmail(authForgotPasswordDto.email)
    if (!user) return { message: 'If an account with this email exists, a password reset link has been sent.' }

    const resetToken: string = this._jwtService.sign(
      { sub: user.uid, email: user.email, role: user.role, abilities: user.abilities, type: 'reset-password' },
      { expiresIn: `${this._configService.get<number>('MAIL_RESET_PASSWORD_VALIDITY') || 1}${this._configService.get<string>('MAIL_RESET_PASSWORD_VALIDITY_UNIT') || 'h'}` as StringValue },
    )

    await this._mailService.sendMail({
      user_name: user.getFullName(),
      user_email: user.email,
      subject: 'Password Reset',
      content: 'reset-password.template.hbs',
      token: resetToken,
      tokenExpires: this._configService.get<number>('MAIL_RESET_PASSWORD_VALIDITY') || 1,
    })
    return { message: 'If an account with this email exists, a password reset link has been sent.' }
  }

  /**
   * @description Resets the user's password using the provided reset password data, which includes a JWT token for authentication and the new password.
   *
   * @param resetAuthDto
   * @returns An object containing a message indicating that the password has been reset successfully.
   * @throws UnauthorizedException if the token is invalid or the user is not found.
   */
  public resetPassword = async (resetAuthDto: AuthResetPasswordDto): Promise<{ message: string }> => {
    const user = await this._usersService.findOne(resetAuthDto.sub)

    if (!user) throw new UnauthorizedException('Invalid token: user not found')

    user.refreshToken = null
    user.password = resetAuthDto.password
    user.passwordChangedAt = new Date()
    await this._usersService.update(user.uid, user)

    return { message: 'Password has been reset successfully.' }
  }

  /**
   * @description Validates stored hash, then rotates the refresh token
   *
   * @param uid
   * @param refreshToken
   * @returns An object containing the JWT token.
   * @throws UnauthorizedException if the user is not found or the password is incorrect.
   */
  public refreshTokens = async (uid: number, refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const user = await this._usersService.validateRefreshToken(uid, refreshToken)
    if (!user) throw new UnauthorizedException('Invalid or expired refresh token')
    return this._issueTokenPair(user)
  }

  /**
   * @description Sends a verification email to the user associated with the provided email address, containing a JWT token for email verification.
   *
   * @param email The email address of the user to whom the verification email will be sent.
   * @returns An object containing a message indicating that the verification email has been sent.
   */
  public sendVerificationEmail = async (email: string): Promise<{ message: string }> => {
    const user = await this._usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('If an account with this email exists, a verification email has been sent.')

    const token = this._jwtService.sign(
      { sub: user.uid, email: user.email, role: user.role, abilities: user.abilities, type: 'verify-email' },
      { expiresIn: `${this._configService.get<number>('MAIL_VERIFY_EMAIL_VALIDITY') || 24}${this._configService.get<string>('MAIL_VERIFY_EMAIL_VALIDITY_UNIT') || 'h'}` as StringValue },
    )

    await this._mailService.sendMail({
      user_name: user.getFullName(),
      user_email: user.email,
      subject: 'Verify your email!',
      content: 'verify-email.template.hbs',
      token,
      tokenExpires: this._configService.get<number>('MAIL_VERIFY_EMAIL_VALIDITY') || 24,
    })
    return { message: 'Verification email sent successfully.' }
  }

  /**
   * @description Confirms the user's email verification by validating the provided user ID and updating the user's verified status in the database.
   *
   * @param userid The ID of the user whose email verification is being confirmed.
   * @returns An object containing a message indicating that the email has been verified successfully.
   * @throws UnauthorizedException if the user is not found.
   */
  public confirmVerficationEmail = async (uid: number): Promise<{ message: string }> => {
    const user = await this._usersService.findOne(uid)
    if (!user) throw new UnauthorizedException('User not found')

    user.verfiedAt = new Date()
    await this._usersService.update(user.uid, user)

    return { message: 'Email has been verified successfully.' }
  }

  /**
   * @description Issues a JWT for a user resolved by GoogleStrategy.
   * Called from the controller after GoogleStrategy sets req.user.
   *
   * @param user - User entity resolved by validateGoogleUser()
   * @returns    - Signed JWT token
   */
  public loginWithGoogle = (user: User): Promise<{ token: string; refreshToken: string }> => {
    return this._issueTokenPair(user)
  }

  /**
   * @description Generates a signed JWT from a User entity.
   *
   * The payload shape must stay consistent with JwtStrategy.validate()
   * since that's what gets decoded and attached to req.user on each request.
   *
   * @param user - Fully resolved User entity from the database
   * @returns    - { token, refreshToken } — the signed JWT string
   */
  private _issueTokenPair = async (user: User): Promise<{ token: string; refreshToken: string }> => {
    const payload = { sub: user.uid, email: user.email, role: user.role, abilities: user.abilities, type: 'login' }

    const accessToken = this._jwtService.sign(payload, {
      secret: this._configService.getOrThrow<string>('AUTH_JWT_ACCESS_SECRET'),
      expiresIn: this._configService.get<StringValue>('AUTH_JWT_ACCESS_EXPIRATION', '15m'),
    })

    const refreshToken = this._jwtService.sign(payload, {
      secret: this._configService.getOrThrow<string>('AUTH_JWT_REFRESH_SECRET'),
      expiresIn: this._configService.get<StringValue>('AUTH_JWT_REFRESH_EXPIRATION', '7d'),
    })

    // save the refresh token
    await this._usersService.setRefreshToken(user.uid, refreshToken)

    return {
      token: accessToken,
      refreshToken: refreshToken,
    }
  }
}
