// user.d.ts (runtime file)
import * as user from '@/common/enums/user.enum'

export {}
declare global {
  namespace Typed {
    namespace User {
      type Role = user.Role
      type Ability = user.Ability
    }
  }
}
