/**
 * @description eUserRole enum defines the various roles that a user can have within the system.
 */
export enum eUserRole {
  ADMIN = 'ADMIN',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  BUSINESS_STUFF = 'BUSINESS_STUFF',
  CLIENT = 'CLIENT',
  GUEST = 'GUEST',
}

/**
 * @description eUserAbility enum defines the various permissions or abilities that a user can have within the system.
 */
export enum eUserAbility {
  TENANT_MOD = 'TENANT_MOD',
  TENANT_VIEW = 'TENANT_VIEW',
  SUBSCRIPTION_MOD = 'SUBSCRIPTION_MOD',
  SUBSCRIPTION_VIEW = 'SUBSCRIPTION_VIEW',
  BUSINESS_MOD = 'BUSINESS_MOD',
  BUSINESS_VIEW = 'BUSINESS_VIEW',
  EMPLOYEE_MOD = 'EMPLOYEE_MOD',
  EMPLOYEE_VIEW = 'EMPLOYEE_VIEW',
  RESOURCE_MOD = 'RESOURCE_MOD',
  RESOURCE_VIEW = 'RESOURCE_VIEW',
  CLIENT_MOD = 'CLIENT_MOD',
  CLIENT_VIEW = 'CLIENT_VIEW',
  RESERVATION_MOD = 'RESERVATION_MOD',
  RESERVATION_VIEW = 'RESERVATION_VIEW',
  BOOKING_MOD = 'BOOKING_MOD',
  BOOKING_VIEW = 'BOOKING_VIEW',
  BOOKING_CANCEL = 'BOOKING_CANCEL',
}

/**
 * @description eSortDirection enum defines the possible sorting directions for query results.
 */
export enum eSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * @description cGenderRole enum defines the possible gender roles for customer entities.
 */
export enum cGenderRole {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
