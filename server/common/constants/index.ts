import { Enum } from '@/common/enums'

export const Constants: Constant = {
  AUTH_SALT: 12,
  ROLE_ABILITIES: {
    [Enum.User.Role.SUPER]: Object.values(Enum.User.Ability),
    [Enum.User.Role.GUEST]: [],
    [Enum.User.Role.BUSINESS_OWNER]: [],
    [Enum.User.Role.BUSINESS_STAFF]: [],
    [Enum.User.Role.CLIENT]: [],
  },
}

interface Constant {
  AUTH_SALT: number
  ROLE_ABILITIES: Record<Typed.User.Role, Typed.User.Ability[]>
}
