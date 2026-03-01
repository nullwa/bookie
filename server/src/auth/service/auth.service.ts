import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import type { StringValue } from 'ms'

import { MailService } from '@/_app/mail/mail.service'
import { UsersService } from '@/users/service/users.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthResetPasswordDto, AuthForgotPasswordDto } from '@/auth/dto/auth-token.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _usersService: UsersService,
    private readonly _mailService: MailService,
    private readonly _configService: ConfigService
  ) { }

  /**
   * @description Authenticates a user and returns a JWT token if the credentials are valid.
   * @param authLoginDto 
   * @returns An object containing the JWT token.
   * @throws UnauthorizedException if the user is not found or the password is incorrect.
   */
  public login = async (authLoginDto: AuthLoginDto): Promise<{ token: string }> => {
    const user = await this._usersService.findByEmail(authLoginDto.email)

    if (!user)
      throw new UnauthorizedException('Invalid credentials: user not found')

    const isValid = await compare(authLoginDto.password, user.password)
    if (!isValid)
      throw new UnauthorizedException('Invalid credentials: password does not match')

    const token = this._jwtService.sign({ sub: user.uid, email: user.email, role: user.role, abilities: user.abilities })
    return { token }
  }

  /**
   * @description Registers a new user using the provided registration data.
   * @param authRegisterDto
   * @returns token
   * @throws UnauthorizedException if the registration fails (e.g., unable to create user).
   */
  public register = async (authRegisterDto: AuthRegisterDto): Promise<{ token: string }> => {
    const user = await this._usersService.create(authRegisterDto)

    if (!user)
      throw new UnauthorizedException('Registration failed: unable to create user')

    this.sendVerificationEmail(user.email)
    return this.login({ email: authRegisterDto.email, password: authRegisterDto.password })
  }

  /**
   * @description Initiates the password reset process by sending a password reset email to the user associated with the provided email address.
   * @param authForgotPasswordDto
   * @returns An object containing a message indicating that the password reset email has been sent.
   */
  public forgotPassword = async (authForgotPasswordDto: AuthForgotPasswordDto): Promise<{ message: string }> => {
    const user = await this._usersService.findByEmail(authForgotPasswordDto.email)

    if (!user)
      throw new UnauthorizedException('User with this email does not exist')

    const resetToken: string = this._jwtService.sign({ sub: user.uid, email: user.email, type: 'reset-password' }, { expiresIn: `${this._configService.get<number>('MAIL_RESET_PASSWORD_VALIDITY') || 1}${this._configService.get<string>('MAIL_RESET_PASSWORD_VALIDITY_UNIT') || 'h'}` as StringValue })
    await this._mailService.sendMail({ user_name: user.getFullName(), user_email: user.email, subject: 'Password Reset', content: 'reset-password.template.hbs', token: resetToken, tokenExpires: this._configService.get<number>('MAIL_RESET_PASSWORD_VALIDITY') || 1 })
    return { message: 'If an account with this email exists, a password reset link has been sent.' }
  }

  /**
   * @description Resets the user's password using the provided reset password data, which includes a JWT token for authentication and the new password.
   * @param resetAuthDto
   * @returns void
   * @throws UnauthorizedException if the token is invalid or the user is not found.
   */
  public resetPassword = async (resetAuthDto: AuthResetPasswordDto): Promise<{ message: string }> => {
    const user = await this._usersService.findOne(resetAuthDto.sub)

    if (!user)
      throw new UnauthorizedException('Invalid token: user not found')

    user.password = resetAuthDto.password
    await this._usersService.update(user.uid, user)
    return { message: 'Password has been reset successfully.' }
  }

  /**
   * @description Sends a verification email to the user associated with the provided email address, containing a JWT token for email verification.
   * @param email
   * @returns An object containing a message indicating that the verification email has been sent.
   */
  public sendVerificationEmail = async (email: string): Promise<{ message: string }> => {
    const user = await this._usersService.findByEmail(email)
    if (!user)
      throw new UnauthorizedException('User with this email does not exist')

    const token = this._jwtService.sign({ sub: user.uid, email: user.email, type: 'verify-email' }, { expiresIn: `${this._configService.get<number>('MAIL_VERIFY_EMAIL_VALIDITY') || 24}${this._configService.get<string>('MAIL_VERIFY_EMAIL_VALIDITY_UNIT') || 'h'}` as StringValue })
    await this._mailService.sendMail({ user_name: user.getFullName(), user_email: user.email, subject: 'Verify your email!', content: 'verify-email.template.hbs', token, tokenExpires: this._configService.get<number>('MAIL_VERIFY_EMAIL_VALIDITY') || 24 })
    return { message: 'Verification email sent successfully.' }
  }


  public confirmVerficationEmail = async (userid: number): Promise<{ message: string }> => {
    const user = await this._usersService.findOne(userid)
    if (!user)
      throw new UnauthorizedException('User not found')
    user.verfiedAt = new Date()
    await this._usersService.update(user.uid, user)
    return { message: 'Email has been verified successfully.' }
  }
}
