'use client'

import { type FC } from 'react'

import { Headline } from '@/common/shared/headline'
import { DotField } from '@/common/shared/dot-field'

type Props = {}

const LandingHero: FC<Props> = ({}) => {
  return (
    <article className='relative flex flex-col items-center px-4 gap-8 bg-linear-to-b from-white from-55% to-brand-600'>
      <div className='w-full flex-1 max-w-container px-6 flex items-center justify-center flex-col gap-10'>
        <div className='w-full relative z-10 flex-1 flex flex-col items-center gap-14'>
          <Headline />
          <div className='flex-1 w-full'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/assets/hero-landing.png' alt='hero landing' className='w-full h-auto' />
          </div>
        </div>
      </div>
      {/* start: dot-field animation */}
      <div className='absolute inset-0 z-0 pointer-events-none' aria-hidden='true'>
        <DotField
          bulgeOnly
          sparkle={true}
          dotRadius={1.5}
          dotSpacing={20}
          glowRadius={160}
          bulgeStrength={67}
          cursorRadius={500}
          waveAmplitude={0}
          cursorForce={0.1}
          gradientFrom='brand-600/60'
          gradientTo='brand-600/0'
          gradientFromStop={0}
          gradientToStop={80}
          glowColor='transparent'
        />
      </div>
      {/* end: dot-field animation */}
    </article>
  )
}

LandingHero.displayName = 'Landing-Hero'
export { LandingHero }
