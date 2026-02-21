import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'

import { UsersService } from '@/users/service/users.service'
import { LoginAuthDto } from '@/auth/dto/login-auth.dto'
import { TokenAuthDto } from '@/auth/dto/token-auth.dto'
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto'
import { ResetPasswordAuthDto } from '@/auth/dto/reset-password-auth.dto'

@Injectable()
export class AuthService {

  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService
  ) { }

  /**
   * @description Authenticates a user and returns a JWT token if the credentials are valid.
   * @param loginAuthDto 
   * @returns An object containing the JWT token.
   * @throws UnauthorizedException if the user is not found or the password is incorrect.
   */
  public login = async (loginAuthDto: LoginAuthDto): Promise<{ token: string }> => {
    const user = await this._usersService.findByEmail(loginAuthDto.email)

    if (!user)
      throw new UnauthorizedException('Invalid credentials: user not found')

    const isValid = await compare(loginAuthDto.password, user.password)
    if (!isValid)
      throw new UnauthorizedException('Invalid credentials: password does not match')

    const token = this._jwtService.sign({ sub: user.uid, email: user.email, role: user.role, abilities: user.abilities })
    return { token }
  }

  /**
   * @description Registers a new user using the provided registration data.
   * @param registerAuthDto
   * @returns 
   */
  public register = async (registerAuthDto: RegisterAuthDto): Promise<string> => {
    const user = await this._usersService.create(registerAuthDto)
    return 'this action register a new user'
  }

  /**
   * @description Verifies the provided JWT token and returns the decoded payload if the token is valid.
   * @param tokenAuthDto 
   * @returns payload token
   */
  public me = async (tokenAuthDto: TokenAuthDto): Promise<any> => {
    const payload = this._jwtService.verify(tokenAuthDto.token)
    return payload
  }

  /**
   * @description Resets the user's password using the provided reset password data, which includes a JWT token for authentication and the new password.
   * @param resetAuthDto
   * @returns void
   * @throws UnauthorizedException if the token is invalid or the user is not found.
   */
  public resetPassword = async (resetAuthDto: ResetPasswordAuthDto): Promise<void> => {
    const payload = this._jwtService.verify(resetAuthDto.token.token)
    const user = await this._usersService.findByEmail(payload.email)

    if (!user)
      throw new UnauthorizedException('Invalid token: user not found')

    user.password = resetAuthDto.password
    await this._usersService.update(user.uid, user)
  }
}
