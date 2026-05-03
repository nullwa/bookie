'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to track if the user has scrolled past a certain threshold.
 *
 * @param upThreshold - ScrollY threshold to consider "scrolled up". If not provided, defaults to half of downThreshold.
 * @param downThreshold - ScrollY threshold to consider "scrolled down". Must be provided.
 * @returns true if the user has scrolled down past the downThreshold, false if they are above the upThreshold.
 */
const useScroll = (upThreshold: number | null, downThreshold: number): boolean => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const scrollUpThreshold = upThreshold ?? downThreshold / 2

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      // Hysteresis: different thresholds for up/down to prevent flickering
      setScrolled((prev) => {
        // Currently scrolled - only unscroll when below lower threshold
        if (prev) return y > scrollUpThreshold
        // Currently not scrolled - only scroll when above higher threshold
        return y > downThreshold
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [downThreshold, scrollUpThreshold])

  return scrolled
}

export { useScroll }
