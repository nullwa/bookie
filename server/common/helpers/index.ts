import { ValueTransformer } from 'typeorm'

export const uniqueArrayTransformer = (): ValueTransformer => ({
  to: (value: string[] | null) => (value ? Array.from(new Set(value)) : value),
  from: (value: string[] | null) => value,
})
