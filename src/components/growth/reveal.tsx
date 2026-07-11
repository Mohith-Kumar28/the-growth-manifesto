import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li'
}

/** Smooth, unobtrusive fade-and-rise for text and general blocks. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  )
}

/*
  Stop-motion: the piece appears in a deliberately "wrong" pose — thrown off to
  the side, tilted, undersized — then jumps into place in two hard cuts through
  a single intermediate frame (3 poses, no interpolation). Big travel + few
  decisive jumps reads as an intentional hand-placed animation, not a glitch.
*/
const SNAP = (t: number): number => (t < 0.34 ? 0 : t < 0.7 ? 0.5 : 1)

type StopMotionProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Starting offset (px) and tilt (deg) — the wild pose it snaps in from. */
  dx?: number
  dy?: number
  rot?: number
  scale?: number
}

export function StopMotion({
  children,
  className,
  delay = 0,
  dx = 0,
  dy = 120,
  rot = -14,
  scale = 0.8,
}: StopMotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: dx, y: dy, rotate: rot, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{
        opacity: { duration: 0.22, delay },
        x: { duration: 0.5, delay, ease: SNAP },
        y: { duration: 0.5, delay, ease: SNAP },
        rotate: { duration: 0.5, delay, ease: SNAP },
        scale: { duration: 0.5, delay, ease: SNAP },
      }}
    >
      {children}
    </motion.div>
  )
}
