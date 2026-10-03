export enum Role {
  GUEST = 'guest',
  SUPER = 'super',
  BUSINESS_OWNER = 'business-owner',
  BUSINESS_STAFF = 'business-staff',
  CLIENT = 'client',
}

export enum Ability {
  USER_VIEW = 'user:view',
  USER_MOD = 'user:mod',
  USER_DELETE = 'user:delete',
  STAFF_VIEW = 'staff:view',
  STAFF_MOD = 'staff:mod',
  STAFF_DELETE = 'staff:delete',
}
