import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

// #region imports
import { UserModel } from '@/modules/user/models/user.model'
import { UserCreateDto } from '@/modules/user/dto/user-create.dto'
// #endregion

@Injectable()
class UserService {
  constructor(@InjectRepository(UserModel) private readonly _userRepository: Repository<UserModel>) {}

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
}
export { UserService }
