'use client'

import { type FC } from 'react'

import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque } from '@/common/utils/fonts'
import { Badge } from '@/common/ui/badge'

type Props = {}

const Platform: FC<Props> = () => {
  return (
    <section className='w-full max-w-wrapper flex items-center justify-center flex-col mx-auto px-6 pt-20 gap-20'>
      <div className='w-full flex items-start justify-center flex-col overflow-hidden'>
        <div className='w-full max-w-wrapper mx-auto flex items-center justify-center flex-col text-center gap-4'>
          <Badge label={'Platform'} variant='ghost' state='brand' />
          <div className='max-w-xl flex items-center justify-center flex-col gap-1'>
            <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>Scheduling intelligence that works the way you do</h1>
            <p className='text-gray-500'>${process.env.NEXT_PUBLIC_APPNAME} doesn’t just show you when people are free. It understands how you work: meeting density, focus rhythms, workload balance. The you use it, the smarter it gets.</p>
          </div>
        </div>
      </div>
      <div className='w-full grid grid-cols-2 gap-4'>
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='https://images.ctfassets.net/p24lh3qexxeo/2CCEaKrAc3TfF9rlDMbbtk/97f965733e258ad064997261aa4094c5/platform-01.jpg?w=3840&fm=webp&q=95' alt='Platform Image 1' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='https://images.ctfassets.net/p24lh3qexxeo/6PwQ40if7Yzrue4vY5UxKR/891e47cea51932404619a8443614ddec/platform-02.jpg?w=3840&fm=webp&q=95' alt='Platform Image 2' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='https://images.ctfassets.net/p24lh3qexxeo/4eELJj6clmh5dWvbcq7Dcl/b563e958757b7f44223d691bf6f45835/platform-03.jpg?w=3840&fm=webp&q=95' alt='Platform Image 3' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='https://images.ctfassets.net/p24lh3qexxeo/41DFWJJyt7u6DE4b5V1JEO/7a1bcab4d21b73c4617789dcec5e2292/platform-04.jpg?w=3840&fm=webp&q=95' alt='Platform Image 3' className='w-full h-full object-cover' />
        </div>
      </div>
    </section>
  )
}

Platform.displayName = 'Platform'
export { Platform }
