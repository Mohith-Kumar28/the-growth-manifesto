import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/*
  Stop-motion easing: progress advances in a few big discrete "hops" rather
  than a smooth glide — the object visibly jumps into position frame by frame,
  the way a stop-motion film moves a puppet. Only 3 frames (2 hops) so it reads
  as deliberate motion, not glitchy flicker.
*/
const stepped =
  (frames: number) =>
  (t: number): number =>
    Math.min(1, Math.floor(t * frames) / (frames - 1))

const HOP = stepped(3)
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li'
}

/** Text / block reveal — fades in, then settles up in a couple of hops. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        opacity: { duration: 0.18, delay },
        y: { duration: 0.55, delay, ease: HOP },
      }}
    >
      {children}
    </MotionTag>
  )
}

type StopMotionProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Starting offset (px) — the piece hops in FROM here. */
  dx?: number
  dy?: number
  /** Starting rotation (deg). */
  rot?: number
  scale?: number
}

/**
 * Punchy stop-motion entrance for images / diagrams / cards. The piece becomes
 * visible immediately, then hops into place through 2 discrete frames — from a
 * noticeable offset + rotation, so it clearly travels into position on scroll.
 */
export function StopMotion({
  children,
  className,
  delay = 0,
  dx = 0,
  dy = 72,
  rot = -6,
  scale = 0.9,
}: StopMotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: dx, y: dy, rotate: rot, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{
        opacity: { duration: 0.2, delay },
        x: { duration: 0.62, delay, ease: HOP },
        y: { duration: 0.62, delay, ease: HOP },
        rotate: { duration: 0.62, delay, ease: HOP },
        scale: { duration: 0.62, delay, ease: HOP },
      }}
    >
      {children}
    </motion.div>
  )
}
