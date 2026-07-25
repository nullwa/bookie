'use client'

import { type FC } from 'react'
import Image from 'next/image'

import { CaretDownIcon } from '@phosphor-icons/react'

import { Button } from '@/common/ui/button'

type Props = {}

const Nav: FC<Props> = () => {
  return (
    <nav className='w-full h-16 bg-white dark:bg-gray-950 flex items-center justify-center px-6'>
      <div className='w-full max-w-wrapper flex items-center justify-between'>
        {/* logo */}
        <Image src={'/logo/logo.svg'} alt={'bookie logo'} width={72} height={'24'} loading={'eager'} />
        {/* navigation links */}
        <div className='flex items-center gap-2'>
          <Button label={'solutions'} variant={'ghost'} iconRight={<CaretDownIcon weight='bold' />} />
          <Button label={'pricing'} variant={'ghost'} />
          <Button label={'about'} variant={'ghost'} />
        </div>
        {/* sign in button -> go to login */}
        <Button label={'Sign in'} state={'default'} />
      </div>
    </nav>
  )
}

Nav.displayName = 'Nav'
export { Nav }
