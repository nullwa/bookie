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
      return { message: 'An account with this email does not exist.' }

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
    const userUpdated = await this._usersService.update(user.uid, user)
    return { message: 'Password has been reset successfully.' }
  }
}
