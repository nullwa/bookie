'use client'
import { type FC, type ReactNode, type ComponentProps } from 'react'
import { cva, tm, type VariantProps } from '@/common/utils/tw-merge'

type Props = ComponentProps<'button'> &
  VariantProps<typeof styles> & {
    label?: string
    loading?: boolean
    icon?: ReactNode
    iconRight?: ReactNode
  }

const Button: FC<Props> = ({ label, loading = false, icon = undefined, iconRight = undefined, state = 'default', variant = 'solid', size = 'md', radius = 'md', disabled = false, className, ...rest }) => {
  const hasText: boolean = label != undefined && typeof label === 'string' && label.trim().length > 0
  return (
    <button data-onlyicon={!hasText} aria-busy={loading} className={tm(styles({ state, variant, size, radius }), className)} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner /> : icon && <span className='shrink-0'>{icon}</span>}
      {hasText && <p className='first-letter:uppercase'>{label}</p>}
      {!loading && iconRight && <span className='shrink-0'>{iconRight}</span>}
    </button>
  )
}

// #region styles
const styles = cva(
  [
    'group/button flex items-center justify-center cursor-pointer gap-1.5',
    'whitespace-nowrap outline-none select-none border',
    'transition-all duration-150',
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current',
  ],
  {
    variants: {
      state: { default: null, brand: null, error: null, success: null, warning: null, info: null },
      variant: { solid: null, filled: null, outline: null, ghost: null, link: 'border-transparent underline-offset-4 hover:underline' },
      size: {
        sm: 'data-[onlyicon=true]:w-7 h-7 data-[onlyicon=false]:px-2 text-xs',
        md: 'data-[onlyicon=true]:w-8 h-8 data-[onlyicon=false]:px-2.5 text-sm',
        lg: 'data-[onlyicon=true]:w-9 h-9 data-[onlyicon=false]:px-4 text-base',
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
      { state: 'default', variant: 'solid', class: 'bg-gray-700 hover:bg-gray-800 border-gray-950 text-white shadow-skeuomorphic' },
      { state: 'default', variant: 'filled', class: 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-100' },
      { state: 'default', variant: 'outline', class: 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800 dark:bg-transparent dark:hover:bg-gray-800 dark:border-gray-600 dark:text-gray-200' },
      { state: 'default', variant: 'ghost', class: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border-transparent' },
      { state: 'default', variant: 'link', class: 'bg-transparent text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white border-transparent' },

      // ─── state: brand ─────────────────────────────────────────────────────────
      { state: 'brand', variant: 'solid', class: 'bg-brand-600 hover:bg-brand-700 border-brand-800 text-white shadow-skeuomorphic' },
      { state: 'brand', variant: 'filled', class: 'bg-brand-50 hover:bg-brand-100 border-brand-300 text-brand-800 dark:bg-brand-950 dark:hover:bg-brand-900 dark:border-brand-700 dark:text-brand-200' },
      { state: 'brand', variant: 'outline', class: 'bg-white hover:bg-brand-50 border-brand-300 text-brand-600 dark:bg-transparent dark:hover:bg-brand-950 dark:border-brand-600 dark:text-brand-400' },
      { state: 'brand', variant: 'ghost', class: 'bg-transparent hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600 dark:text-brand-400 border-transparent' },
      { state: 'brand', variant: 'link', class: 'bg-transparent text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 border-transparent' },

      // ─── state: error ─────────────────────────────────────────────────────────
      { state: 'error', variant: 'solid', class: 'bg-red-600 hover:bg-red-700 border-red-800 text-white shadow-skeuomorphic' },
      { state: 'error', variant: 'filled', class: 'bg-red-50 hover:bg-red-100 border-red-300 text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-700 dark:text-red-200' },
      { state: 'error', variant: 'outline', class: 'bg-white hover:bg-red-50 border-red-300 text-red-600 dark:bg-transparent dark:hover:bg-red-950 dark:border-red-600 dark:text-red-400' },
      { state: 'error', variant: 'ghost', class: 'bg-transparent hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 border-transparent' },
      { state: 'error', variant: 'link', class: 'bg-transparent text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-transparent' },
      // ─── state: success ───────────────────────────────────────────────────────
      { state: 'success', variant: 'solid', class: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-800 text-white shadow-skeuomorphic' },
      { state: 'success', variant: 'filled', class: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-200' },
      { state: 'success', variant: 'outline', class: 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-transparent dark:hover:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-400' },
      { state: 'success', variant: 'ghost', class: 'bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-transparent' },
      { state: 'success', variant: 'link', class: 'bg-transparent text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 border-transparent' },
      // ─── state: warning ───────────────────────────────────────────────────────
      { state: 'warning', variant: 'solid', class: 'bg-amber-600 hover:bg-amber-700 border-amber-800 text-white shadow-skeuomorphic' },
      { state: 'warning', variant: 'filled', class: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900 dark:border-amber-700 dark:text-amber-200' },
      { state: 'warning', variant: 'outline', class: 'bg-white hover:bg-amber-50 border-amber-300 text-amber-600 dark:bg-transparent dark:hover:bg-amber-950 dark:border-amber-600 dark:text-amber-400' },
      { state: 'warning', variant: 'ghost', class: 'bg-transparent hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-600 dark:text-amber-400 border-transparent' },
      { state: 'warning', variant: 'link', class: 'bg-transparent text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 border-transparent' },
      // ─── state: info ──────────────────────────────────────────────────────────
      { state: 'info', variant: 'solid', class: 'bg-violet-600 hover:bg-violet-700 border-violet-800 text-white shadow-skeuomorphic' },
      { state: 'info', variant: 'filled', class: 'bg-violet-50 hover:bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-950 dark:hover:bg-violet-900 dark:border-violet-700 dark:text-violet-200' },
      { state: 'info', variant: 'outline', class: 'bg-white hover:bg-violet-50 border-violet-300 text-violet-600 dark:bg-transparent dark:hover:bg-violet-950 dark:border-violet-600 dark:text-violet-400' },
      { state: 'info', variant: 'ghost', class: 'bg-transparent hover:bg-violet-50 dark:hover:bg-violet-950 text-violet-600 dark:text-violet-400 border-transparent' },
      { state: 'info', variant: 'link', class: 'bg-transparent text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 border-transparent' },
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

// #region spinner
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <svg className={{ sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }[size]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
    <path d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z' opacity='.25' fill='currentColor' />
    <path d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z' fill='currentColor'>
      <animateTransform attributeName='transform' type='rotate' dur='0.75s' values='0 12 12;360 12 12' repeatCount='indefinite' />
    </path>
  </svg>
)
// #endregion

Button.displayName = 'Button'
export { Button }
