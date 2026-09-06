export enum Role {
  GUEST = 'guest',
  SUPER = 'super',
  BUSINESS_OWNER = 'business-owner',
  BUSINESS_STAFF = 'business-staff',
  CLIENT = 'client',
}

export enum Ability {
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
}
