'use client'

import { type CSSProperties, type FC, useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'

import { Badge } from '@/common/ui/badge'
import { Jumbotron } from '@/common/components/jumbotron'

type Props = {
  items: {
    id: number
    label: string
    image: string
  }[]
}

const ServiceExplore: FC<Props> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const distance = useMotionValue(0)

  // Measure layout and set dynamic height directly on DOM (bypasses React state re-renders)
  useEffect(() => {
    const gallery = galleryRef.current
    const container = containerRef.current
    if (!gallery || !container) return

    const updateDimensions = () => {
      const scrollWidth = gallery.scrollWidth
      const clientWidth = gallery.parentElement?.clientWidth ?? window.innerWidth
      const totalScrollDistance = Math.max(0, scrollWidth - clientWidth)

      distance.set(totalScrollDistance)
      // Exactly 1 viewport height for sticky + horizontal distance needed
      container.style.height = `${window.innerHeight + totalScrollDistance}px`
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(gallery)
    window.addEventListener('resize', updateDimensions)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [items, distance])

  // Track container scroll progress cleanly (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll directly to negative X translation
  const rawX = useTransform([scrollYProgress, distance], (values) => -(values as [number, number])[0] * (values as [number, number])[1])
  // Add smooth physics momentum (removes jitter when user stops scrolling abruptly)
  const x = useSpring(rawX, { stiffness: 200, damping: 28, mass: 0.2 })

  return (
    <section>
      <div ref={containerRef} className='relative w-full'>
        <div className='sticky top-0 flex h-1/2 w-full items-start justify-center flex-col overflow-hidden'>
          <Jumbotron tag='services' title='Explore tools for your unique craft' description='From solo practitioners to multi-location teams, Acuity adapts to how you work.' />
          <motion.div ref={galleryRef} style={{ x }} className='flex w-max gap-6 pr-6 will-change-transform pl-6 xl:pl-[calc((100%-72rem)/2)]'>
            {items.map((item) => (
              <div key={item.id} className='relative h-125 w-80 shrink-0 overflow-hidden rounded-xl bg-cover bg-center' style={{ backgroundImage: `url(${item.image})` } as CSSProperties}>
                <div className='absolute bottom-8 left-8'>
                  <h2 className='text-2xl font-semibold text-white'>{item.label}</h2>
                </div>
              </div>
            ))}
          </motion.div>
          <div className='w-full max-w-6xl mx-auto px-4 py-20 flex items-center justify-center flex-col gap-4'>
            <Badge label='Explore all services' variant='filled' size='lg' suffix={<ArrowUpRightIcon weight='bold' />} />
          </div>
        </div>
      </div>
    </section>
  )
}

ServiceExplore.displayName = 'ServiceExplore'

export { ServiceExplore }
