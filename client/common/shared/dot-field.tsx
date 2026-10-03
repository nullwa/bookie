'use client'
import { useEffect, useRef, useState, memo, useId } from 'react'

const TWO_PI = Math.PI * 2

interface Dot {
  ax: number
  ay: number
  sx: number
  sy: number
  vx: number
  vy: number
  x: number
  y: number
}

interface DotFieldProps {
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  cursorForce?: number
  bulgeOnly?: boolean
  bulgeStrength?: number
  glowRadius?: number
  sparkle?: boolean
  waveAmplitude?: number
  /** Raw CSS color OR a Tailwind theme token, e.g. "purple-500", "purple-500/40", "brand-600" */
  gradientFrom?: string
  /** Raw CSS color OR a Tailwind theme token */
  gradientTo?: string
  /** Percentage (0-100) where gradientFrom is fully applied. Flat before this point. Default 0. */
  gradientFromStop?: number
  /** Percentage (0-100) where gradientTo is fully applied. Flat after this point. Default 100. */
  gradientToStop?: number
  /** Raw CSS color OR a Tailwind theme token */
  glowColor?: string
  [key: string]: unknown
}

// Colors that are already valid raw CSS and shouldn't be looked up as theme tokens.
const RAW_COLOR_PATTERN = /^(#|rgb\(|rgba\(|hsl\(|hsla\(|oklch\(|oklab\(|lab\(|lch\(|color\(|var\(|transparent$|currentcolor$)/i

/**
 * Resolves a Tailwind v4 theme color token (e.g. "purple-500", "purple-500/40",
 * "brand-600") into an actual CSS color string by reading the corresponding
 * `--color-*` custom property off :root. Falls back to returning the input
 * unchanged if it's already a raw CSS color, if called on the server, or if
 * the token isn't found — so this is always safe to call.
 *
 * This does NOT generate any Tailwind class names, so there's no JIT/content-
 * scanning purge issue with using it dynamically.
 */
function resolveTailwindColor(token: string): string {
  if (typeof window === 'undefined' || !token) return token
  const trimmed = token.trim()
  if (RAW_COLOR_PATTERN.test(trimmed)) return trimmed

  const [colorName, opacity] = trimmed.split('/')
  const varName = `--color-${colorName}`
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()

  if (!value) return trimmed // not a recognized token — treat as a raw CSS color/keyword

  if (opacity) {
    const pct = Math.max(0, Math.min(100, Number(opacity)))
    if (!Number.isNaN(pct)) {
      return `color-mix(in oklab, ${value} ${pct}%, transparent)`
    }
  }

  return value
}

const DotField = memo(
  ({
    dotRadius = 1.5,
    dotSpacing = 14,
    cursorRadius = 500,
    cursorForce = 0.1,
    bulgeOnly = true,
    bulgeStrength = 67,
    glowRadius = 160,
    sparkle = false,
    waveAmplitude = 0,
    gradientFrom = 'brand-600/0',
    gradientTo = 'brand-600',
    gradientFromStop = 65,
    gradientToStop = 100,

    glowColor = 'transparent',
    ...rest
  }: DotFieldProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const glowRef = useRef<SVGCircleElement>(null)
    const dotsRef = useRef<Dot[]>([])
    const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 })
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 })
    const glowOpacity = useRef(0)
    const engagement = useRef(0)
    const propsRef = useRef<Record<string, unknown>>({})
    propsRef.current = {
      dotRadius,
      dotSpacing,
      cursorRadius,
      cursorForce,
      bulgeOnly,
      bulgeStrength,
      sparkle,
      waveAmplitude,
      gradientFromStop,
      gradientToStop,
    }
    const rebuildRef = useRef<(() => void) | null>(null)
    const redrawStaticRef = useRef<(() => void) | null>(null)
    const isVisibleRef = useRef(true)
    const glowId = `dot-field-glow-${useId()}`

    // Resolved, canvas-ready color strings live in a ref (read inside the rAF
    // loop, doesn't need to trigger React renders).
    const resolvedColorsRef = useRef({
      gradientFrom,
      gradientTo,
    })
    // The glow's <stop> is rendered by React/SVG. Start with the raw token
    // (matches what the server rendered) and resolve to the real color only
    // after mount, in an effect — resolving eagerly here via a useState
    // initializer would run during the client's first render too and diverge
    // from the server-rendered markup, causing a hydration mismatch.
    const [resolvedGlow, setResolvedGlow] = useState(glowColor)

    // Re-resolve whenever any color prop changes (including the initial
    // post-mount resolution).
    useEffect(() => {
      resolvedColorsRef.current = {
        gradientFrom: resolveTailwindColor(gradientFrom),
        gradientTo: resolveTailwindColor(gradientTo),
      }
      setResolvedGlow(resolveTailwindColor(glowColor))
      // If the loop is currently paused (reduced motion / off-screen),
      // repaint immediately so the color change isn't invisible until resume.
      redrawStaticRef.current?.()
    }, [gradientFrom, gradientTo, glowColor])

    useEffect(() => {
      const canvas = canvasRef.current
      const glowEl = glowRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let resizeTimer: ReturnType<typeof setTimeout>

      const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      let prefersReducedMotion = reduceMotionQuery.matches

      function resize() {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(doResize, 100)
      }

      function doResize() {
        const rect = canvas!.parentElement!.getBoundingClientRect()
        const w = rect.width
        const h = rect.height

        canvas!.width = w * dpr
        canvas!.height = h * dpr
        canvas!.style.width = `${w}px`
        canvas!.style.height = `${h}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

        sizeRef.current = {
          w,
          h,
          offsetX: rect.left + window.scrollX,
          offsetY: rect.top + window.scrollY,
        }

        buildDots(w, h)

        if (prefersReducedMotion || !isVisibleRef.current) {
          drawStatic(w, h)
        }
      }

      function buildDots(w: number, h: number) {
        const p = propsRef.current
        const step = (p.dotRadius as number) + (p.dotSpacing as number)
        const cols = Math.floor(w / step)
        const rows = Math.floor(h / step)
        const padX = (w % step) / 2
        const padY = (h % step) / 2
        const dots: Dot[] = new Array(rows * cols)
        let idx = 0

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const ax = padX + col * step + step / 2
            const ay = padY + row * step + step / 2
            dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay }
          }
        }
        dotsRef.current = dots
      }

      // Builds the vertical (top-to-bottom) 3-stop gradient shared by both
      // drawStatic and tick. Mirrors Tailwind's `from-X from-Y% to-Z`
      // pattern: gradientFrom holds flat until gradientStop%, then
      // transitions to gradientTo by 100%.
      function buildGradient(h: number) {
        const c = resolvedColorsRef.current
        const p = propsRef.current
        const fromStop = Math.max(0, Math.min(100, p.gradientFromStop as number)) / 100
        const toStop = Math.max(0, Math.min(100, p.gradientToStop as number)) / 100
        const grad = ctx!.createLinearGradient(0, 0, 0, h)
        if (fromStop > 0) grad.addColorStop(0, c.gradientFrom)
        grad.addColorStop(fromStop, c.gradientFrom)
        grad.addColorStop(toStop, c.gradientTo)
        if (toStop < 1) grad.addColorStop(1, c.gradientTo)
        return grad
      }

      // Renders the grid at rest, no animation loop involved. Used for
      // reduced-motion users and while the section is scrolled off-screen.
      function drawStatic(w: number, h: number) {
        const dots = dotsRef.current
        const p = propsRef.current
        const rad = (p.dotRadius as number) / 2

        ctx!.clearRect(0, 0, w, h)
        ctx!.fillStyle = buildGradient(h)

        ctx!.beginPath()
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i]
          ctx!.moveTo(d.ax + rad, d.ay)
          ctx!.arc(d.ax, d.ay, rad, 0, TWO_PI)
        }
        ctx!.fill()
      }

      function onMouseMove(e: MouseEvent) {
        const s = sizeRef.current
        mouseRef.current.x = e.pageX - s.offsetX
        mouseRef.current.y = e.pageY - s.offsetY
      }

      function updateMouseSpeed() {
        const m = mouseRef.current
        const dx = m.prevX - m.x
        const dy = m.prevY - m.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        m.speed += (dist - m.speed) * 0.5
        if (m.speed < 0.001) m.speed = 0
        m.prevX = m.x
        m.prevY = m.y
      }

      const speedInterval = setInterval(updateMouseSpeed, 20)

      let frameCount = 0

      function tick() {
        // Bail out of the animation loop entirely when the user prefers
        // reduced motion or the section isn't on screen. rafRef is left
        // null so callers know the loop isn't running.
        if (prefersReducedMotion || !isVisibleRef.current) {
          rafRef.current = null
          return
        }

        frameCount++
        const dots = dotsRef.current
        const m = mouseRef.current
        const { w, h } = sizeRef.current
        const p = propsRef.current
        const len = dots.length
        const t = frameCount * 0.02

        const targetEngagement = Math.min(m.speed / 5, 1)
        engagement.current += (targetEngagement - engagement.current) * 0.06
        if (engagement.current < 0.001) engagement.current = 0
        const eng = engagement.current

        glowOpacity.current += (eng - glowOpacity.current) * 0.08

        if (glowEl) {
          glowEl.setAttribute('cx', String(m.x))
          glowEl.setAttribute('cy', String(m.y))
          glowEl.style.opacity = String(glowOpacity.current)
        }

        ctx!.clearRect(0, 0, w, h)
        ctx!.fillStyle = buildGradient(h)

        const cr = p.cursorRadius as number
        const crSq = cr * cr
        const rad = (p.dotRadius as number) / 2
        const isBulge = p.bulgeOnly as boolean

        ctx!.beginPath()

        for (let i = 0; i < len; i++) {
          const d = dots[i]
          const dx = m.x - d.ax
          const dy = m.y - d.ay
          const distSq = dx * dx + dy * dy

          if (distSq < crSq && eng > 0.01) {
            const dist = Math.sqrt(distSq)
            if (isBulge) {
              const tt = 1 - dist / cr
              const push = tt * tt * (p.bulgeStrength as number) * eng
              const angle = Math.atan2(dy, dx)
              d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
              d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
            } else {
              const angle = Math.atan2(dy, dx)
              const move = (500 / dist) * (m.speed * (p.cursorForce as number))
              d.vx += Math.cos(angle) * -move
              d.vy += Math.sin(angle) * -move
            }
          } else if (isBulge) {
            d.sx += (d.ax - d.sx) * 0.1
            d.sy += (d.ay - d.sy) * 0.1
          }

          if (!isBulge) {
            d.vx *= 0.9
            d.vy *= 0.9
            d.x = d.ax + d.vx
            d.y = d.ay + d.vy
            d.sx += (d.x - d.sx) * 0.1
            d.sy += (d.y - d.sy) * 0.1
          }

          let drawX = d.sx
          let drawY = d.sy
          if ((p.waveAmplitude as number) > 0) {
            drawY += Math.sin(d.ax * 0.03 + t) * (p.waveAmplitude as number)
            drawX += Math.cos(d.ay * 0.03 + t * 0.7) * (p.waveAmplitude as number) * 0.5
          }

          if (p.sparkle) {
            const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0
            if (hash % 100 < 3) {
              ctx!.moveTo(drawX + rad * 1.8, drawY)
              ctx!.arc(drawX, drawY, rad * 1.8, 0, TWO_PI)
            } else {
              ctx!.moveTo(drawX + rad, drawY)
              ctx!.arc(drawX, drawY, rad, 0, TWO_PI)
            }
          } else {
            ctx!.moveTo(drawX + rad, drawY)
            ctx!.arc(drawX, drawY, rad, 0, TWO_PI)
          }
        }

        ctx!.fill()

        rafRef.current = requestAnimationFrame(tick)
      }

      function startLoop() {
        if (rafRef.current == null && !prefersReducedMotion && isVisibleRef.current) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }

      function onReducedMotionChange(e: MediaQueryListEvent) {
        prefersReducedMotion = e.matches
        if (prefersReducedMotion) {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
          }
          const { w, h } = sizeRef.current
          drawStatic(w, h)
        } else {
          startLoop()
        }
      }

      doResize()
      window.addEventListener('resize', resize)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      reduceMotionQuery.addEventListener('change', onReducedMotionChange)

      // Pause the RAF loop whenever the hero scrolls out of view, resume
      // when it re-enters.
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting
          if (entry.isIntersecting) {
            startLoop()
          } else if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
          }
        },
        { threshold: 0 },
      )
      observer.observe(canvas)

      startLoop()

      rebuildRef.current = () => {
        const { w, h } = sizeRef.current
        if (w > 0 && h > 0) buildDots(w, h)
      }
      redrawStaticRef.current = () => {
        const { w, h } = sizeRef.current
        if (w > 0 && h > 0 && (prefersReducedMotion || !isVisibleRef.current)) drawStatic(w, h)
      }

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        clearInterval(speedInterval)
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMouseMove)
        reduceMotionQuery.removeEventListener('change', onReducedMotionChange)
        observer.disconnect()
      }
    }, [])

    useEffect(() => {
      rebuildRef.current?.()
    }, [dotRadius, dotSpacing])

    return (
      <div className='w-full h-full relative' {...rest}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}>
          <defs>
            <radialGradient id={glowId}>
              <stop offset='0%' stopColor={resolvedGlow} />
              <stop offset='100%' stopColor='transparent' />
            </radialGradient>
          </defs>
          <circle ref={glowRef} cx='-9999' cy='-9999' r={glowRadius} fill={`url(#${glowId})`} style={{ opacity: 0, willChange: 'opacity' }} />
        </svg>
      </div>
    )
  },
)

DotField.displayName = 'DotField'
export { DotField }
