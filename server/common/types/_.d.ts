import { auth } from '@/common/types/auth'
import { user } from '@/common/types/user'
declare global {
  namespace Typed {
    export import Auth = auth
    export import User = user
  }
}

export {}
