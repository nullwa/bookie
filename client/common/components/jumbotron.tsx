'use client'

import { type FC } from 'react'
import { useRouter } from 'next/navigation'

import { Badge } from '@/common/ui/badge'
import { Button } from '@/common/ui/button'
import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque } from '@/common/utils/fonts'

type Props = {
  tag: string
  title: string
  description: string
  fullWidth?: boolean
  withAction?: boolean
  centered?: boolean
  navigation?: {
    label?: string
    href?: string
  }
}

const Jumbotron: FC<Props> = ({ tag, title, description, fullWidth = false, withAction = false, centered = true, navigation }) => {
  const { push } = useRouter()
  return (
    <div className={tm('w-full max-w-6xl mx-auto flex items-center justify-center flex-col gap-4', centered && 'text-center')}>
      <Badge label={tag} variant='ghost' state='brand' />
      <div className={tm('flex items-center justify-center flex-col gap-1', fullWidth ? 'w-full' : 'max-w-xl')}>
        <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>{title}</h1>
        <p className='text-gray-500'>{description}</p>
      </div>
      {withAction && (
        <div>
          <Button label={navigation?.label} onClick={() => navigation?.href && push(navigation?.href)} />
        </div>
      )}
    </div>
  )
}

Jumbotron.displayName = 'Jumbotron'
export { Jumbotron }
