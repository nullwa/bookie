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
   * @param {IdentityModel} _identityModel - Identity model the enable account linking when authenticating
   */
  constructor(@InjectRepository(IdentityModel) private readonly _identityModel: Repository<IdentityModel>) {}

  public verifyIdentifier = (identifier: string): Promise<boolean> => {
    return this._identityModel.exists({ where: { identifier } })
  }

  public findUserIdentityByProviderAndIdentifier = (provider: Typed.Auth.Provider, identifier: string): Promise<IdentityModel | null> => {
    return this._identityModel.findOne({ where: { provider, identifier } })
  }
}
export { IdentityService }
