'use client'

import { type FC, useState } from 'react'

import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque, geistMono } from '@/common/utils/fonts'
import { Badge } from '@/common/ui/badge'

type Props = {}

const steps = [
  {
    number: '01',
    title: 'Set up your booking page',
    description: 'Add your services, prices, and availability, then sync your calendar so you never get double-booked.',
    image: '/assets/gif/create-service-page.gif',
    color: '#dee7f1',
  },
  {
    number: '02',
    title: 'Share your link',
    description: 'Drop it in a text, an email, your Instagram bio, or embed it right on your website.',
    image: '/assets/gif/create-response.gif',
    color: '#f3dbd1',
  },
  {
    number: '03',
    title: 'Clients book themselves',
    description: 'They pick an open time, pay a deposit if you require one, and get a confirmation instantly. No back-and-forth.',
    image: '/assets/gif/create-calendar-booking.gif',
    color: '#b5a9de',
  },
]

const LandingHowItWorks: FC<Props> = ({}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [displayedStep, setDisplayedStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const handleStepClick = (index: number) => {
    if (index === activeStep) return
    setActiveStep(index)
    setVisible(false)
  }

  const handleTransitionEnd = () => {
    if (!visible) {
      setDisplayedStep(activeStep)
      setVisible(true)
    }
  }

  return (
    <section className='w-full max-w-container mx-auto px-6 py-24'>
      <div className='flex flex-col items-center gap-4'>
        <Badge label='[How It Works]' variant='filled' />
        <div className='max-w-xl flex flex-col items-center gap-2'>
          <h2 className={tm('text-4xl font-semibold tracking-tight text-center', bricolageGrotesque.className)}>Start accepting bookings</h2>
          <p className='text-center text-gray-500'>No setup calls, no imports to babysit. Most people take their first booking within ten minutes.</p>
        </div>
      </div>

      <div className='mt-12 relative h-90 overflow-hidden border border-gray-200 flex items-center justify-center transition-colors duration-300 ease-in-out' style={{ background: steps[activeStep].color }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={steps[displayedStep].image} alt={steps[displayedStep].title} onTransitionEnd={handleTransitionEnd} className={tm('h-full object-cover transition-opacity duration-300 ease-in-out', visible ? 'opacity-100' : 'opacity-0')} />
      </div>

      <div className='mt-16 grid gap-6 md:grid-cols-3'>
        {steps.map((step, index) => (
          <button key={step.number} type='button' onClick={() => handleStepClick(index)} className='text-left rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-gray-200 p-3 focus:outline-none'>
            <div className={tm('flex h-full flex-col rounded-lg border p-6 shadow-xs transition-colors bg-white', index === activeStep ? 'border-gray-300' : 'border-gray-200')}>
              <span className={tm('text-5xl tracking-tight font-semibold mb-10 opacity-50', geistMono.className)} style={{ color: step.color }}>
                {step.number}
              </span>
              <h3 className='text-xl font-semibold tracking-tight mb-2 first-letter:capitalize'>{step.title}</h3>
              <p className='text-sm text-gray-500 leading-tight'>{step.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

LandingHowItWorks.displayName = 'landing-how-it-works'
export { LandingHowItWorks }
