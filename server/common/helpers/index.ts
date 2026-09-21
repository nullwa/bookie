import { ValueTransformer } from 'typeorm'
import ms, { type StringValue } from 'ms'

export const uniqueArrayTransformer = (): ValueTransformer => ({
  to: (value: string[] | null) => (value ? Array.from(new Set(value)) : value),
  from: (value: string[] | null) => value,
})

export const getExpiryDate = (expiresIn: StringValue): Date => {
  return new Date(Date.now() + ms(expiresIn))
}
