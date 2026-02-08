import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'

import { TokenAuthDto } from '@/auth/dto/token-auth.dto'
import { LoginAuthDto } from '@/auth/dto/login-auth.dto'
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto'
import { UsersService } from '@/users/service/users.service'

@Injectable()
export class AuthService {

  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService
  ) { }

  /**
   * @description Authenticates a user and returns a JWT token if the credentials are valid.
   * @param createAuthDto 
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
}
