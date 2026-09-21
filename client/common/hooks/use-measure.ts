import { useCallback, useEffect, useRef, useState } from 'react'

export type RectReadOnly = {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

type UseMeasureOptions = {
  /** Also re-measure on scroll (position can change without a resize) */
  scroll?: boolean
  /** Use border-box size instead of content-box size */
  offsetSize?: boolean
  /** Extra debounce on top of RAF batching. 0 = RAF-batched only (recommended) */
  debounce?: number
}

export type UseMeasureRef<T extends Element = Element> = (node: T | null) => void

export type UseMeasureResult<T extends Element = Element> = [
  UseMeasureRef<T>,
  RectReadOnly,
  () => void, // forceRefresh
]

const zeroRect: RectReadOnly = Object.freeze({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

export function useMeasure<T extends Element = Element>({ scroll = false, offsetSize = false, debounce = 0 }: UseMeasureOptions = {}): UseMeasureResult<T> {
  const [bounds, setBounds] = useState<RectReadOnly>(zeroRect)

  // All mutable, non-reactive state lives in refs — none of it should
  // ever be read during render.
  const elementRef = useRef<T | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const pendingEntryRef = useRef<ResizeObserverEntry | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const debounceIdRef = useRef<number | null>(null)
  const lastBoundsRef = useRef<RectReadOnly>(zeroRect)

  const applyBounds = useCallback((next: RectReadOnly) => {
    const prev = lastBoundsRef.current
    if (prev.width === next.width && prev.height === next.height && prev.top === next.top && prev.left === next.left) {
      return // no-op: skip a wasted render
    }
    lastBoundsRef.current = next
    setBounds(next)
  }, [])

  // Reads from the ResizeObserverEntry already produced by the browser's
  // layout pass — no additional getBoundingClientRect()/offsetWidth call,
  // so no extra forced reflow on every resize.
  const measure = useCallback(() => {
    const entry = pendingEntryRef.current
    if (!entry) return

    const { contentRect } = entry
    const borderBox = entry.borderBoxSize?.[0]

    const width = offsetSize && borderBox ? borderBox.inlineSize : contentRect.width
    const height = offsetSize && borderBox ? borderBox.blockSize : contentRect.height

    applyBounds({
      x: contentRect.x,
      y: contentRect.y,
      width,
      height,
      top: contentRect.top,
      right: contentRect.right,
      bottom: contentRect.bottom,
      left: contentRect.left,
    })
  }, [offsetSize, applyBounds])

  const scheduleMeasure = useCallback(() => {
    // Coalesce into a single measurement per frame — ResizeObserver can
    // fire synchronously/repeatedly within one tick, and batching here
    // is what actually prevents "ResizeObserver loop limit exceeded".
    if (rafIdRef.current !== null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      measure()
    })
  }, [measure])

  const handleChange = useCallback(() => {
    if (debounce > 0) {
      if (debounceIdRef.current !== null) {
        window.clearTimeout(debounceIdRef.current)
      }
      debounceIdRef.current = window.setTimeout(scheduleMeasure, debounce)
    } else {
      scheduleMeasure()
    }
  }, [debounce, scheduleMeasure])

  // Observer lifecycle — entirely inside an effect, never during render.
  useEffect(() => {
    if (!isBrowser || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      // One observed target per instance here, so entries[0] is always
      // the relevant (and only) entry.
      const entry = entries[0]
      if (!entry) return
      pendingEntryRef.current = entry
      handleChange()
    })
    observerRef.current = observer

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
      observerRef.current = null
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
      if (debounceIdRef.current !== null) window.clearTimeout(debounceIdRef.current)
    }
  }, [handleChange])

  useEffect(() => {
    if (!scroll || !isBrowser) return
    window.addEventListener('scroll', handleChange, {
      capture: true,
      passive: true,
    })
    return () => window.removeEventListener('scroll', handleChange, true)
  }, [scroll, handleChange])

  // Ref callback — runs in the commit phase, safe to read/write refs here.
  const ref = useCallback<UseMeasureRef<T>>(
    (node) => {
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current)
      }

      elementRef.current = node

      if (node && observerRef.current) {
        observerRef.current.observe(node)

        // No ResizeObserverEntry exists yet on first attach (the observer
        // hasn't fired), so a single getBoundingClientRect() here is the
        // unavoidable exception — it's one read, not a thrash.
        const rect = node.getBoundingClientRect()
        applyBounds({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        })
      } else if (!node) {
        lastBoundsRef.current = zeroRect
        setBounds(zeroRect)
      }
    },
    [applyBounds],
  )

  const forceRefresh = useCallback(() => {
    const el = elementRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    applyBounds({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    })
  }, [applyBounds])

  return [ref, bounds, forceRefresh]
}
