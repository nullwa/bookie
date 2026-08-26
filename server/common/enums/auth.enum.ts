export const Provider = {
  GOOGLE: 'google',
  LOCAL: 'local',
  PHONE: 'phone',
}

export type Provider = (typeof Provider)[keyof typeof Provider]
