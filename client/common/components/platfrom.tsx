'use client'

import { type FC } from 'react'

import { Jumbotron } from '@/common/components/jumbotron'

type Props = {}

const Platform: FC<Props> = () => {
  return (
    <section>
      <div className='flex w-full items-start justify-center flex-col overflow-hidden'>
        <Jumbotron
          tag='Platform'
          title='Scheduling intelligence that works the way you do'
          description={`${process.env.NEXT_PUBLIC_APPNAME} doesn’t just show you when people are free. It understands how you work: meeting density, focus rhythms, workload balance. The you use it, the smarter it gets.`}
        />
      </div>
    </section>
  )
}

Platform.displayName = 'Platform'
export { Platform }
