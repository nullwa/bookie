import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'

import { UsersService } from '@/users/service/users.service'
import { AuthLoginDto, AuthRegisterDto } from '@/auth/dto/auth-mutate.dto'
import { AuthTokenDto, AuthResetPasswordDto } from '@/auth/dto/auth-token.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService
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

    return this.login({ email: user.email, password: user.password })
  }

  /**
   * @description Verifies the provided JWT token and returns the decoded payload if the token is valid.
   * @param authTokenDto 
   * @returns payload token
   */
  public me = async (authTokenDto: AuthTokenDto): Promise<any> => {
    const payload = this._jwtService.verify(authTokenDto.token)
    return payload
  }

  /**
   * @description Resets the user's password using the provided reset password data, which includes a JWT token for authentication and the new password.
   * @param resetAuthDto
   * @returns void
   * @throws UnauthorizedException if the token is invalid or the user is not found.
   */
  public resetPassword = async (resetAuthDto: AuthResetPasswordDto): Promise<void> => {
    const payload = this._jwtService.verify(resetAuthDto.token.token)
    const user = await this._usersService.findByEmail(payload.email)

    if (!user)
      throw new UnauthorizedException('Invalid token: user not found')

    user.password = resetAuthDto.password
    await this._usersService.update(user.uid, user)
  }

  public sendEmailVerification = async (email: string): Promise<void> => { }
}
