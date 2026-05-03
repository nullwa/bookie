import { type FC, type ComponentProps, type ReactNode } from 'react'

import { tm } from '@/common/utils/tailwind-merge'

type Props = ComponentProps<'a'> & {
  label: string
  href: string
  icon: ReactNode
  description?: string
}

const LinkItem: FC<Props> = ({ label, description, icon, className, href, ...props }) => {
  return (
    <a className={tm('flex items-center gap-x-2', className)} href={href} {...props}>
      <div className={tm('flex aspect-square size-12 items-center justify-center rounded-md border bg-card text-sm shadow-sm', "[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground")}>{icon}</div>
      <div className='flex flex-col items-start justify-center'>
        <span className='font-medium'>{label}</span>
        <span className='line-clamp-2 text-muted-foreground text-xs'>{description}</span>
      </div>
    </a>
  )
}

LinkItem.displayName = 'LinkItem'
export { LinkItem }
