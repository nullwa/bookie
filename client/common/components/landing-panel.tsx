'use client'

import { type FC } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'

import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque } from '@/common/utils/fonts'
import { Badge } from '@/common/ui/badge'
import { Button } from '@/common/ui/button'

type Props = {}

const LandingPanel: FC<Props> = () => {
  return (
    <section className='w-full max-w-container flex items-center justify-center flex-col mx-auto px-6 pt-20 gap-20'>
      <div className='w-full flex items-start justify-center flex-col overflow-hidden'>
        <div className='w-full max-w-container mx-auto flex items-center justify-center flex-col text-center gap-4'>
          <Badge label={'Platform'} variant='ghost' state='brand' />
          <div className='max-w-xl flex items-center justify-center flex-col gap-1'>
            <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>For businesses, first impressions matter</h1>
            <p className='text-gray-500'>Unbeatable customizations give you all the benefits of online scheduling with a brand experience to boost your growing business.</p>
          </div>
        </div>
      </div>
      <div className='w-full grid grid-cols-2 gap-4'>
        <div className='col-span-2 bg-gray-100 flex items-center gap-20'>
          <div className='flex-1 p-6 flex items-start justify-center flex-col'>
            <h3 className={tm('text-2xl font-semibold tracking-tight', bricolageGrotesque.className)}>Book beautifully, 24/7</h3>
            <p className='text-gray-500 w-full pb-6'>Set up any type of appointment and let clients easily self-schedule on your branded booking page.</p>
            <Button label='create your free booking page' iconRight={<ArrowUpRightIcon weight={'bold'} />} state={'brand'} size={'lg'} />
          </div>
          <div className='flex-1'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='https://youcanbook.me/hs-fs/hubfs/2025%20brand/2025%20Home%20Page/images/first-impressions-1.png?width=2240&name=first-impressions-1.png' alt='image custom store' className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='col-span-1 bg-gray-100'>
          <div className='h-96 flex justify-end'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='https://cdn-marketing.acuityscheduling.com/img/marketing/squarespace/v3/frontsite/feature-area/no-shows-desktop.avif' alt='image custom store' className='w-full h-full object-bottom object-cover' />
          </div>
          <div className='p-6 flex items-start justify-center flex-col'>
            <h3 className={tm('text-2xl font-semibold tracking-tight', bricolageGrotesque.className)}>Book beautifully, 24/7</h3>
            <p className='text-gray-500 w-full pb-4'>Set up any type of appointment and let clients easily self-schedule on your branded booking page.</p>
            <Button label='create your free booking page' iconRight={<ArrowUpRightIcon weight={'bold'} />} variant={'link'} className='data-[onlyicon=false]:px-0' />
          </div>
        </div>
        <div className='col-span-1 bg-gray-100'>
          <div className='h-96 flex justify-end'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='https://youcanbook.me/hs-fs/hubfs/2025%20brand/2025%20Home%20Page/images/make-money@2x.png?width=1050&name=make-money@2x.png' alt='image custom store' className='w-full h-full object-bottom object-cover' />
          </div>
          <div className='p-6 flex items-start justify-center flex-col'>
            <h3 className={tm('text-2xl font-semibold tracking-tight', bricolageGrotesque.className)}>Book beautifully, 24/7</h3>
            <p className='text-gray-500 w-full pb-4'>Set up any type of appointment and let clients easily self-schedule on your branded booking page.</p>
            <Button label='create your free booking page' iconRight={<ArrowUpRightIcon weight={'bold'} />} variant={'link'} className='data-[onlyicon=false]:px-0' />
          </div>
        </div>
      </div>
    </section>
  )
}

LandingPanel.displayName = 'landing-panel'
export { LandingPanel }
