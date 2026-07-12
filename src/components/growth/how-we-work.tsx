import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Step = {
  n: string
  title: string
  desc: string
  weeks: string
  image: string
  dotClass: string
  weeksClass: string
}

const STEPS: Array<Step> = [
  {
    n: '01',
    title: 'Discovery Call',
    desc: 'We surface your pain points, real barrier, and North Star plus product, ICP, and budget.',
    weeks: 'Weeks 1',
    image: '/assets/how-we-work/step1.webp',
    dotClass: 'bg-brand-red',
    weeksClass: 'text-brand-red',
  },
  {
    n: '02',
    title: 'Growth Map',
    desc: 'A 90-day, channel-by-channel funnel, ranked by where your ICP actually is, with budget attached.',
    weeks: 'Weeks 1-2',
    image: '/assets/how-we-work/step2.webp',
    dotClass: 'bg-brand-gold',
    weeksClass: 'text-brand-gold',
  },
  {
    n: '03',
    title: 'Execution Plan',
    desc: 'Once aligned: a week-by-week plan with the actions to run and KPIs we track weekly.',
    weeks: 'Weeks 2-3',
    image: '/assets/how-we-work/step3.webp',
    dotClass: 'bg-brand-green',
    weeksClass: 'text-brand-green',
  },
  {
    n: '04',
    title: 'Execute & Review',
    desc: 'We ship, then review the KPIs together every week adjusting as we go.',
    weeks: 'Ongoing',
    image: '/assets/how-we-work/step4.webp',
    dotClass: 'bg-ink',
    weeksClass: 'text-ink',
  },
]

function StepHeader({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-fell text-[28px] whitespace-nowrap italic capitalize text-ink-soft md:text-[40px]">
        How We Work
      </h2>
      <span
        className={`h-[13px] w-[13px] shrink-0 rounded-full transition-colors duration-500 ${step.dotClass}`}
      />
      <span className="h-px flex-1 bg-ink/40" />
      <span
        className={`font-caslon text-[16px] whitespace-nowrap transition-colors duration-500 ${step.weeksClass}`}
      >
        {step.weeks}
      </span>
    </div>
  )
}

function StepText({ step }: { step: Step }) {
  return (
    <div className="flex max-w-[280px] flex-col items-end text-right">
      <span className="font-caslon text-[56px] leading-none text-ink-soft md:text-[72px]">
        {step.n}
      </span>
      <span className="mt-3 font-caslon text-[20px] text-ink md:text-[22px]">
        {step.title}
      </span>
      <p className="mt-5 font-fell text-[18px] leading-snug text-gray-body md:text-[20px]">
        {step.desc}
      </p>
    </div>
  )
}

export function HowWeWork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const progress =
        travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      const idx = Math.min(
        STEPS.length - 1,
        Math.floor(progress * STEPS.length),
      )
      setActive(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="work-with"
      className="mx-auto w-full max-w-[1076px] px-6 md:px-10"
    >
      {/* Image pins & morphs step-by-step while the copy swaps; on mobile the
          same effect runs with the image and copy stacked vertically */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${STEPS.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-svh flex-col justify-center py-10 md:h-screen md:py-16">
          <StepHeader step={STEPS[active]} />

          <div className="mt-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[1.35fr_0.65fr] md:gap-8">
            <div className="relative aspect-[3/2] md:-ml-[6%]">
              {STEPS.map((s, i) => (
                <motion.img
                  key={s.n}
                  src={s.image}
                  alt={i === active ? `Step ${s.n}: ${s.title}` : ''}
                  aria-hidden={i !== active}
                  loading="lazy"
                  decoding="async"
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                />
              ))}
            </div>

            <div className="relative flex min-h-[220px] items-center justify-end md:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -22 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex justify-end"
                >
                  <StepText step={STEPS[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
