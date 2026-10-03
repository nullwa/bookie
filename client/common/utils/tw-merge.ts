import { twMerge } from 'tailwind-merge'
import { cva, type VariantProps, cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/types'

/**
 * Wrapper around twMerge + cx.
 * Ensures tailwind classes are merged correctly.
 */
const tm = (...inputs: ClassValue[]) => {
  return twMerge(cx(...inputs))
}

export { cva, VariantProps, tm }
