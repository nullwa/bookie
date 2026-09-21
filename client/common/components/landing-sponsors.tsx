'use client'

import { type FC } from 'react'

import { Ticker } from '@/common/shared/ticker'

type Props = {
  items: { src: string; alt?: string; title?: string }[]
}

const LandingSponsors: FC<Props> = ({ items }) => {
  return (
    <section className='bg-brand-600'>
      <div className='w-full max-w-container px-6 py-10 mx-auto mask-[linear-gradient(to_right,transparent,black,transparent)]'>
        <Ticker gap={64} reverse speed={80} speedOnHover={14}>
          {items.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={logo.alt} className='pointer-events-none h-5 brightness-0 invert select-none' height='auto' key={`logo-${logo.alt}`} loading='lazy' src={logo.src} width='auto' />
          ))}
        </Ticker>
      </div>
    </section>
  )
}

LandingSponsors.displayName = 'landing-sponsors'
export { LandingSponsors }
