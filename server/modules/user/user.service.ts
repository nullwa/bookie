import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, LessThan, Repository } from 'typeorm'

// #region imports
import { UserModel } from '@/modules/user/models/user.model'
import { TokenModel } from '@/modules/user/models/token.model'

import { UserCreateDto } from '@/modules/user/dto/user.dto'
import { TokenCreateDto } from '@/modules/user/dto/token.dto'
// #endregion

@Injectable()
class UserService {
  constructor(
    @InjectRepository(UserModel) private readonly _userRepository: Repository<UserModel>,
    @InjectRepository(TokenModel) private readonly _tokenRepository: Repository<TokenModel>
  ) {}

  public create = (userCreateDto: Partial<UserCreateDto>) => {
    const user: UserModel = this._userRepository.create(userCreateDto)
    return this._userRepository.save(user)
  }

  public find = (uid: number): Promise<UserModel | null> => {
    return this._userRepository.findOne({ where: { uid } })
  }

  public findByEmailWithPassword = (email: string): Promise<UserModel | null> => {
    return this._userRepository.findOne({
      where: { email },
      select: { uid: true, email: true, password: true, firstName: true, lastName: true, role: true, abilities: true },
    })
  }

  public isUserExists = (email: string): Promise<boolean> => {
    return this._userRepository.exists({ where: { email } })
  }

  /**
   * @description Adds an authentication token for a user in the database
   * This method creates a new TokenModel entity using the provided tokenCreateDto and associates it with the specified user.
   * @param {TokenCreateDto} tokenCreateDto
   * @param {UserModel} user
   * @returns {Promise<TokenModel>} A promise that resolves to the newly created TokenModel entity
   */
  public addAuthenticationToken = (tokenCreateDto: TokenCreateDto, user: UserModel): Promise<TokenModel> => {
    const token: TokenModel = this._tokenRepository.create({ ...tokenCreateDto, user })
    return this._tokenRepository.save(token)
  }

  public findValidToken = async (token: string, type: Typed.Auth.Purpose): Promise<TokenModel | null> => {
    const found = await this._tokenRepository.findOne({
      where: { token, type },
      relations: { user: true },
    })

    if (!found) return null

    if (found.expiresAt < new Date()) {
      await this._tokenRepository.delete({ token, type })
      return null
    }

    return found
  }

  public deleteToken = (token: string, type: Typed.Auth.Purpose): Promise<DeleteResult> => {
    return this._tokenRepository.delete({ token, type })
  }

  public purgeExpiredTokens = (): Promise<DeleteResult> => {
    return this._tokenRepository.delete({ expiresAt: LessThan(new Date()) })
  }
}
export { UserService }
