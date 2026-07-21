'use client'
import { type FC, type ReactNode, type ComponentProps } from 'react'
import { cva, tm, type VariantProps } from '@/common/utils/tw-merge'

type Props = ComponentProps<'span'> &
  VariantProps<typeof styles> & {
    label?: string
    count?: number
    affix?: ReactNode
    suffix?: ReactNode
  }

const Badge: FC<Props> = ({ label, count, affix, suffix, state, variant, size, radius, className, ...rest }) => {
  if (!(Boolean(label?.trim()) || count !== undefined || affix !== undefined || suffix !== undefined)) return null

  return (
    <span className={tm(styles({ state, variant, size, radius }), className)} {...rest}>
      {affix && <span className='shrink-0'>{affix}</span>}
      {label && <span className='truncate first-letter:uppercase'>{label}</span>}
      {count !== undefined && <span className='tabular-nums'>{count}</span>}
      {suffix && <span className='shrink-0'>{suffix}</span>}
    </span>
  )
}

// #region styles
const styles = cva(
  [
    'group/badge flex items-center justify-center cursor-pointer gap-1',
    'whitespace-nowrap outline-none select-none border',
    'transition-all duration-150',
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current',
  ],
  {
    variants: {
      state: { default: null, brand: null, error: null, success: null, warning: null, info: null },
      variant: { solid: null, filled: null, outline: null, ghost: null },
      size: {
        sm: 'h-5 px-1 text-xs',
        md: 'h-6 px-1.5 text-xs',
        lg: 'h-7 px-1.5 text-sm',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        rounded: 'rounded-full',
      },
    },
    compoundVariants: [
      // ─── state: default ───────────────────────────────────────────────────────
      { state: 'default', variant: 'solid', class: 'bg-gray-900 hover:bg-gray-800 border-gray-950 dark:border-gray-700 text-white' },
      { state: 'default', variant: 'filled', class: 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-100' },
      { state: 'default', variant: 'outline', class: 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800 dark:bg-transparent dark:hover:bg-gray-800 dark:border-gray-600 dark:text-gray-200' },
      { state: 'default', variant: 'ghost', class: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border-transparent' },
      // ─── state: brand ─────────────────────────────────────────────────────────
      { state: 'brand', variant: 'solid', class: 'bg-brand-600 hover:bg-brand-700 border-brand-700 dark:border-brand-500 text-white' },
      { state: 'brand', variant: 'filled', class: 'bg-brand-50 hover:bg-brand-100 border-brand-300 text-brand-800 dark:bg-brand-950 dark:hover:bg-brand-900 dark:border-brand-700 dark:text-brand-200' },
      { state: 'brand', variant: 'outline', class: 'bg-white hover:bg-brand-50 border-brand-300 text-brand-600 dark:bg-transparent dark:hover:bg-brand-950 dark:border-brand-600 dark:text-brand-400' },
      { state: 'brand', variant: 'ghost', class: 'bg-transparent hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600 dark:text-brand-400 border-transparent' },
      // ─── state: error ─────────────────────────────────────────────────────────
      { state: 'error', variant: 'solid', class: 'bg-red-600 hover:bg-red-700 border-red-700 dark:border-red-500 text-white' },
      { state: 'error', variant: 'filled', class: 'bg-red-50 hover:bg-red-100 border-red-300 text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-700 dark:text-red-200' },
      { state: 'error', variant: 'outline', class: 'bg-white hover:bg-red-50 border-red-300 text-red-600 dark:bg-transparent dark:hover:bg-red-950 dark:border-red-600 dark:text-red-400' },
      { state: 'error', variant: 'ghost', class: 'bg-transparent hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 border-transparent' },
      // ─── state: success ───────────────────────────────────────────────────────
      { state: 'success', variant: 'solid', class: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700 dark:border-emerald-500 text-white' },
      { state: 'success', variant: 'filled', class: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-200' },
      { state: 'success', variant: 'outline', class: 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-transparent dark:hover:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-400' },
      { state: 'success', variant: 'ghost', class: 'bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-transparent' },
      // ─── state: warning ───────────────────────────────────────────────────────
      { state: 'warning', variant: 'solid', class: 'bg-amber-600 hover:bg-amber-700 border-amber-700 dark:border-amber-500 text-white' },
      { state: 'warning', variant: 'filled', class: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900 dark:border-amber-700 dark:text-amber-200' },
      { state: 'warning', variant: 'outline', class: 'bg-white hover:bg-amber-50 border-amber-300 text-amber-600 dark:bg-transparent dark:hover:bg-amber-950 dark:border-amber-600 dark:text-amber-400' },
      { state: 'warning', variant: 'ghost', class: 'bg-transparent hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-600 dark:text-amber-400 border-transparent' },
      // ─── state: info ──────────────────────────────────────────────────────────
      { state: 'info', variant: 'solid', class: 'bg-violet-600 hover:bg-violet-700 border-violet-700 dark:border-violet-500 text-white' },
      { state: 'info', variant: 'filled', class: 'bg-violet-50 hover:bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-950 dark:hover:bg-violet-900 dark:border-violet-700 dark:text-violet-200' },
      { state: 'info', variant: 'outline', class: 'bg-white hover:bg-violet-50 border-violet-300 text-violet-600 dark:bg-transparent dark:hover:bg-violet-950 dark:border-violet-600 dark:text-violet-400' },
      { state: 'info', variant: 'ghost', class: 'bg-transparent hover:bg-violet-50 dark:hover:bg-violet-950 text-violet-600 dark:text-violet-400 border-transparent' },
    ],
    defaultVariants: {
      state: 'default',
      variant: 'solid',
      size: 'md',
      radius: 'md',
    },
  },
)
// #endregion

Badge.displayName = 'Badge'
export { Badge }
