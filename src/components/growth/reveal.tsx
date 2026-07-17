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

