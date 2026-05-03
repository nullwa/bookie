'use client'

import { type FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/common/ui/button'
import { NavigationDesktop } from '@/common/components/navigation-desktop'

import { tm } from '@/common/utils/tailwind-merge'
import { useScroll } from '@/common/hooks/use-scroll'

type Props = {}

const Header: FC<Props> = ({}) => {
  const scrolled = useScroll(null, 10)
  return (
    <header className={tm('sticky top-0 z-50 w-full border-transparent border-b', { 'border-border bg-primary-solid/95 backdrop-blur-sm supports-backdrop-filter:bg-primary-solid/50': scrolled })}>
      <nav className='mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 gap-4'>
        <Link href='/' passHref>
          <Image src='logo/icon-black.svg' alt='Bookie Logo' loading='eager' width={28} height={28} />
        </Link>
        <div className='w-full'>
          <NavigationDesktop />
        </div>
        <div>
          <Button size={'lg'}>Sign In</Button>
        </div>
      </nav>
    </header>
  )
}

export { Header }
