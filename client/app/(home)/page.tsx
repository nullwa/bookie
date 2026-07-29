import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque } from '@/common/utils/fonts'

import { Navigation } from '@/common/components/layout-nav'
import { LandingHero } from '@/common/components/landing-hero'
import { LandingService } from '@/common/components/landing-service'
import { LandingSponsors } from '@/common/components/landing-sponsors'

export default function Page() {
  return (
    <main>
      <Navigation />
      <LandingHero />
      <LandingSponsors
        items={[
          {
            src: 'https://storage.efferd.com/logo/nvidia-wordmark.svg',
            alt: 'Nvidia Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/supabase-wordmark.svg',
            alt: 'Supabase Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/openai-wordmark.svg',
            alt: 'OpenAI Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/turso-wordmark.svg',
            alt: 'Turso Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/vercel-wordmark.svg',
            alt: 'Vercel Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/github-wordmark.svg',
            alt: 'GitHub Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/claude-wordmark.svg',
            alt: 'Claude AI Logo',
          },
          {
            src: 'https://storage.efferd.com/logo/clerk-wordmark.svg',
            alt: 'Clerk Logo',
          },
        ]}
      />
      <LandingService
        items={[
          { id: 1, label: 'Beauty salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/2G1KL3MPpLXync6nFtHffM/7509ea438b7d65b4e5eb405bcdd13526/PD07338_USEN-ES_Card_1.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 2, label: 'Barbershops', image: 'https://images.ctfassets.net/2d5q1td6cyxq/tM53RHm0PCPi0JeVDNvFG/3442196d523c0d141b2b014c6b87ba72/PD07338_USEN-ES_Card_2.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 3, label: 'Hair salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/Px7qJWysr8xGOtagMGnre/371e83feeae33c4d8dd5ae1fd5f009f0/PD07338_USEN-ES_Card_3.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 4, label: 'Nail salons', image: 'https://images.ctfassets.net/2d5q1td6cyxq/3RO4pVpNlH3W4ovZvDMhzM/4e101401a12f1ffb29d1648bf3a44fea/PD07338_USEN-ES_Card_4.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 5, label: 'Day spas', image: 'https://images.ctfassets.net/2d5q1td6cyxq/7xufsldsT1kAAy7sx7vdOr/3b4162968cc7ba9be68565c0d2f3bca8/PD07338_USEN-ES_Card_5.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 6, label: 'Tattoo & piercing', image: 'https://images.ctfassets.net/2d5q1td6cyxq/4eXblIc2XINOe6E31lzI0F/36d4a702bdc43c9ab1378403ac36d984/PD07338_USEN-ES_Card_6.png?fm=avif&q=85&fit=fill&w=710' },
          { id: 7, label: 'Med spas', image: 'https://images.ctfassets.net/2d5q1td6cyxq/7qLfXfviKccUqZ18cDHuX4/615536490429859b193d830cb64625ab/PD07338_USEN-ES_Card_7.png?fm=avif&q=85&fit=fill&w=710' },
        ]}
      />

      <article className={'w-full max-w-container flex mx-auto px-6 pt-20 gap-20'}>
        <div className='flex-1 flex flex-col gap-1'>
          <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>Say goodbye to scheduling chaos</h1>
          <p className='text-gray-500'>Use {process.env.NEXT_PUBLIC_APPNAME} booking software to manage appointments, staff availability, and services all from one place — synced in real time.</p>
        </div>
        <div className='flex-1'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='https://images.ctfassets.net/2d5q1td6cyxq/4kQdHqlNQWBcCorzJOxD8o/a7edc932b4029bd1a1bd4bf283b92135/PD07333_USEN_Module_1_Desktop.png?fm=avif&q=85&fit=fill&w=1460'
            alt='Platform Image 1'
            className='w-full h-full object-cover'
          />
        </div>
      </article>
      <article className={'w-full max-w-container flex mx-auto px-6 pt-20 gap-20'}>
        <div className='flex-1'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='https://images.ctfassets.net/2d5q1td6cyxq/H4UTv2I0pC4Ad8Gvwaniz/ce612794504546c5629e150db3adb1e3/PD07334_USEN_Module_2_Desktop.png?fm=avif&q=85&fit=fill&w=1460'
            alt='Platform Image 2'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='flex-1 flex flex-col gap-1'>
          <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>Take payments online and in person</h1>
          <p className='text-gray-500'>Accept payments in-studio, on the go, and online with all sales connected in one system — no extra apps needed.</p>
        </div>
      </article>
      <article className={'w-full max-w-container flex mx-auto px-6 pt-20 gap-20'}>
        <div className='flex-1 flex flex-col gap-1'>
          <h1 className={tm('text-4xl font-semibold tracking-tight', bricolageGrotesque.className)}>Send reminders and more, automatically</h1>
          <p className='text-gray-500'>Send customizable email and SMS messages for appointment confirmations, reminders, and easy rescheduling.</p>
        </div>
        <div className='flex-1'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='https://images.ctfassets.net/2d5q1td6cyxq/5FNc3R15l9rUnXiUNlXFAq/3190518f5f49115b06c6f2debd750883/PD07335_USEN_Module_3_Desktop.png?fm=avif&q=85&fit=fill&w=1460'
            alt='Platform Image 3'
            className='w-full h-full object-cover'
          />
        </div>
      </article>
    </main>
  )
}
