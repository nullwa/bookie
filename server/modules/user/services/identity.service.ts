import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Enum } from '@/common/enums'
import { IdentityModel } from '@/modules/user/models/identity.model'

@Injectable()
export class IdentityService {
  /**
   *
   */
  constructor(@InjectRepository(IdentityModel) private readonly identityRepository: Repository<IdentityModel>) {}

  public findByProvider = (provider: typeof Enum.Auth.Provider, identifier: string): Promise<IdentityModel | null> => {
    return this.identityRepository.findOne({ where: { provider, identifier } })
  }
}
