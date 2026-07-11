import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Butter-smooth momentum scrolling via Lenis. Drives the real window scroll
 * (not a transform) so sticky sections and scroll math keep working.
 * Automatically disabled when the user prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    ;(window as unknown as { lenis?: Lenis }).lenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as unknown as { lenis?: Lenis }).lenis
    }
  }, [])

  return null
}

/** Smooth-scrolls to an element id, using Lenis when available. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as { lenis?: Lenis }).lenis
  if (lenis) lenis.scrollTo(el, { offset: -90 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
