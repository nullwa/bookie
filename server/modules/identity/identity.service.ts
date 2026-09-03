import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

// #region imports
import { IdentityModel } from '@/modules/identity/models/identity.model'
// #endregion

@Injectable()
class IdentityService {
  /**
   * Ctor
   *
   * @param {IdentityModel} _identityRepository - Identity model the enable account linking when authenticating
   */
  constructor(@InjectRepository(IdentityModel) private readonly _identityRepository: Repository<IdentityModel>) {}

  public verifyIdentifier = (identifier: string): Promise<boolean> => {
    return this._identityRepository.exists({ where: { identifier }, relations: { user: true } })
  }

  public findUserIdentityByProviderAndIdentifier = (provider: Typed.Auth.Provider, identifier: string): Promise<IdentityModel | null> => {
    return this._identityRepository.findOne({ where: { provider, identifier }, relations: { user: true } })
  }

  public findUserWithPasswordByProviderAndIdentifier = (provider: Typed.Auth.Provider, identifier: string): Promise<IdentityModel | null> => {
    return this._identityRepository.findOne({
      where: { provider, identifier },
      select: { uid: true, provider: true, identifier: true, password: true, isVerified: true, isDefaultAccount: true },
      relations: { user: true },
    })
  }
}
export { IdentityService }
