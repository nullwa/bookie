'use client'

import { type FC } from 'react'
import Image from 'next/image'

import { Button } from '@/common/ui/button'

type Props = {}

const Navigation: FC<Props> = () => {
  return (
    <nav className='w-full max-w-container mx-auto px-4 h-16 flex items-center justify-center'>
      <div className='w-full flex items-center justify-between'>
        {/* logo */}
        <Image src={'/logo/logo.svg'} alt={'bookie logo'} width={72} height={'24'} loading={'eager'} />
        {/* navigation links */}
        <div className='flex items-center gap-2'>
          <Button label={'solutions'} variant={'ghost'} />
          <Button label={'pricing'} variant={'ghost'} />
          <Button label={'about'} variant={'ghost'} />
        </div>
        {/* sign in button -> go to login */}
        <Button label={'Sign in'} state={'default'} />
      </div>
    </nav>
  )
}

Navigation.displayName = 'navigation'
export { Navigation }
