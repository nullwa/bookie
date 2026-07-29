import { type FC } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react'

import { Button } from '@/common/ui/button'
import { Badge } from '@/common/ui/badge'
import { tm } from '@/common/utils/tw-merge'
import { bricolageGrotesque } from '@/common/utils/fonts'

type Props = {}

const Headline: FC<Props> = ({}) => (
  <div className='w-full flex flex-col gap-8 p-6'>
    <div className='w-full flex items-center justify-center flex-col gap-4'>
      <Badge label='Used by fast-growing B2B teams' variant={'filled'} />
      <h1 className={tm('w-full capitalize font-semibold text-4xl md:text-5xl lg:text-6xl text-center tracking-tight fade-in slide-in-from-bottom-10 animate-in delay-100 duration-500 ease-out', bricolageGrotesque.className)}>
        the booking experience <br /> your clients expect.
      </h1>
      <p className='w-full max-w-2xl text-sm sm:text-base text-gray-600 text-center'>
        Upgrade from clunky spreadsheets and phone calls, give your clients a sleek, frictionless reservation portal that elevates your brand from the very first click.
      </p>
    </div>
    <div className='flex items-center justify-center gap-2'>
      <Button label='get started' variant={'solid'} state={'brand'} size='lg' iconRight={<CaretRightIcon weight={'bold'} />} />
      <Button label='watch a demo' variant={'outline'} state={'default'} size='lg' />
    </div>
  </div>
)

Headline.displayName = 'headline'
export { Headline }
