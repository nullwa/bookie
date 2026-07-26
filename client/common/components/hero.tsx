'use client'

import { type FC } from 'react'

import { CaretRightIcon } from '@phosphor-icons/react'

import { Button } from '@/common/ui/button'
import { bricolageGrotesque } from '@/common/utils/fonts'

type Props = {}

const Hero: FC<Props> = () => {
  return (
    <section className='bg-linear-to-b from-white from-55% to-brand-600 flex items-center justify-center flex-col pt-20 gap-20'>
      {/* jumbotron */}
      <div className='w-full max-w-container flex flex-col items-center justify-center gap-8'>
        {/* hero title -> description */}
        <div className='w-full max-w-xl flex items-center justify-center flex-col gap-4'>
          <h1 className={`text-3xl sm:text-5xl ${bricolageGrotesque.className} font-bold text-center first-letter:capitalize`}>
            the booking experience <br /> your clients expect.
          </h1>
          <p className='text-sm sm:text-base text-gray-600 text-center'>Upgrade from clunky spreadsheets and phone calls, give your clients a sleek, frictionless reservation portal that elevates your brand from the very first click.</p>
        </div>
        {/* call to action buttons */}
        <div className='flex items-center justify-center gap-2'>
          <Button label='get started' variant={'solid'} state={'brand'} size='lg' iconRight={<CaretRightIcon weight={'bold'} />} />
          <Button label='watch a demo' variant={'outline'} size='lg' />
        </div>
      </div>
      {/* image landing */}
      <div className='w-full max-w-5xl px-6'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/assets/hero-landing.png' alt='hero landing' className='w-full h-auto rounded' />
      </div>
    </section>
  )
}

Hero.displayName = 'Hero'
export { Hero }
