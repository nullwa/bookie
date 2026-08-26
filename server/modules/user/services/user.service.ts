import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserModel } from '@/modules/user/models/user.model'

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(@InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>) {}

  public find = (uid: number): Promise<UserModel | null> => {
    return this.userRepository.findOne({ where: { uid } })
  }
}
