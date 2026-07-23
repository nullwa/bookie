'use client'

import { type FC } from 'react'

import { Jumbotron } from '@/common/components/jumbotron'

type Props = {}

const Platform: FC<Props> = () => {
  return (
    <section className='w-full max-w-6xl flex items-center justify-center flex-col mx-auto px-4 pt-20 gap-20'>
      <div className='w-full flex items-start justify-center flex-col overflow-hidden'>
        <Jumbotron
          tag='Platform'
          title='Scheduling intelligence that works the way you do'
          description={`${process.env.NEXT_PUBLIC_APPNAME} doesn’t just show you when people are free. It understands how you work: meeting density, focus rhythms, workload balance. The you use it, the smarter it gets.`}
        />
      </div>
      <div className='w-full grid grid-cols-2 gap-4'>
        <div className=''>
          <img src='https://images.ctfassets.net/p24lh3qexxeo/2CCEaKrAc3TfF9rlDMbbtk/97f965733e258ad064997261aa4094c5/platform-01.jpg?w=3840&fm=webp&q=95' alt='Platform Image 1' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          <img src='https://images.ctfassets.net/p24lh3qexxeo/6PwQ40if7Yzrue4vY5UxKR/891e47cea51932404619a8443614ddec/platform-02.jpg?w=3840&fm=webp&q=95' alt='Platform Image 2' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          <img src='https://images.ctfassets.net/p24lh3qexxeo/4eELJj6clmh5dWvbcq7Dcl/b563e958757b7f44223d691bf6f45835/platform-03.jpg?w=3840&fm=webp&q=95' alt='Platform Image 3' className='w-full h-full object-cover' />
        </div>
        <div className=''>
          <img src='https://images.ctfassets.net/p24lh3qexxeo/41DFWJJyt7u6DE4b5V1JEO/7a1bcab4d21b73c4617789dcec5e2292/platform-04.jpg?w=3840&fm=webp&q=95' alt='Platform Image 3' className='w-full h-full object-cover' />
        </div>
      </div>
    </section>
  )
}

Platform.displayName = 'Platform'
export { Platform }
