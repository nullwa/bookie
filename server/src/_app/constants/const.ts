import { eUserAbility, eUserRole } from '@/_app/constants/enum';

/**
 * @description The number of salt rounds to use when hashing passwords with bcrypt.
 * A higher number means more security but also more time to hash and verify passwords.
 * The default value is 10, but you can adjust it based on your security requirements and performance needs.
 */
export const SALT_ROUND = 12


/**
 * @description A mapping of user roles to their corresponding abilities. This is used to define what actions each role can perform in the application.
 * The ADMIN role has full access to all abilities, while other roles have specific abilities assigned to them based on their responsibilities.
 * This mapping is crucial for implementing role-based access control (RBAC) in the application, allowing us to restrict or grant access to certain features based on the user's role.
 */
export const ROLE_ABILITIES: Record<string, string[]> = {
  [eUserRole.ADMIN]: Object.values(eUserAbility), // full access
  [eUserRole.BUSINESS_OWNER]: [
    eUserAbility.BUSINESS_MOD,
    eUserAbility.BUSINESS_VIEW,
    eUserAbility.EMPLOYEE_MOD,
    eUserAbility.EMPLOYEE_VIEW,
    eUserAbility.RESOURCE_MOD,
    eUserAbility.RESOURCE_VIEW,
    eUserAbility.CLIENT_MOD,
    eUserAbility.CLIENT_VIEW,
    eUserAbility.RESERVATION_MOD,
    eUserAbility.RESERVATION_VIEW,
    eUserAbility.BOOKING_MOD,
    eUserAbility.BOOKING_VIEW,
    eUserAbility.BOOKING_CANCEL,
  ],
  [eUserRole.BUSINESS_STUFF]: [
    eUserAbility.EMPLOYEE_MOD,
    eUserAbility.EMPLOYEE_VIEW,
    eUserAbility.RESOURCE_MOD,
    eUserAbility.RESOURCE_VIEW,
    eUserAbility.CLIENT_VIEW,
    eUserAbility.RESERVATION_VIEW,
    eUserAbility.BOOKING_VIEW,
    eUserAbility.BOOKING_CANCEL,
  ],
  [eUserRole.CLIENT]: [
    eUserAbility.BOOKING_VIEW,
    eUserAbility.BOOKING_CANCEL,
  ],
  [eUserRole.GUEST]: [],
};
