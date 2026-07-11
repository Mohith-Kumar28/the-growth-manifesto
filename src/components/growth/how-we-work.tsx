import { useEffect, useRef, useState } from 'react'

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
    image: '/assets/growth/colosseum.png',
    dotClass: 'bg-brand-red',
    weeksClass: 'text-brand-red',
  },
  {
    n: '02',
    title: 'Growth Map',
    desc: 'A 90-day, channel-by-channel funnel, ranked by where your ICP actually is, with budget attached.',
    weeks: 'Weeks 1-2',
    image: '/assets/growth/step2.png',
    dotClass: 'bg-brand-gold',
    weeksClass: 'text-brand-gold',
  },
  {
    n: '03',
    title: 'Execution Plan',
    desc: 'Once aligned: a week-by-week plan with the actions to run and KPIs we track weekly.',
    weeks: 'Weeks 2-3',
    image: '/assets/growth/step3.png',
    dotClass: 'bg-brand-green',
    weeksClass: 'text-brand-green',
  },
  {
    n: '04',
    title: 'Execute & Review',
    desc: 'We ship, then review the KPIs together every week adjusting as we go.',
    weeks: 'Ongoing',
    image: '/assets/growth/step4.png',
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
    <div className="flex max-w-[260px] flex-col items-end text-right">
      <span className="font-caslon text-[52px] leading-none text-ink-soft md:text-[64px]">
        {step.n}
      </span>
      <span className="mt-3 font-caslon text-[20px] text-ink">
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
      {/* Desktop: pinned image that morphs step-by-step while the copy scrolls */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ height: `${STEPS.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center py-10">
          <StepHeader step={STEPS[active]} />

          <div className="mt-4 grid grid-cols-2 items-center gap-10">
            <div className="relative aspect-[4/3]">
              {STEPS.map((s, i) => (
                <img
                  key={s.n}
                  src={s.image}
                  alt={i === active ? `Step ${s.n}: ${s.title}` : ''}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-opacity duration-700 ease-out ${
                    i === active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            <div className="relative flex min-h-[280px] items-center justify-end">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className={`absolute right-0 flex justify-end transition-all duration-700 ease-out ${
                    i === active
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-8 opacity-0'
                  }`}
                >
                  <StepText step={s} />
                </div>
              ))}
            </div>
          </div>

          {/* progress ticks */}
          <div className="mt-10 flex justify-center gap-3">
            {STEPS.map((s, i) => (
              <span
                key={s.n}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? 'w-8 bg-ink' : 'w-4 bg-ink/25'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: the same steps stacked vertically */}
      <div className="py-14 md:hidden">
        {STEPS.map((s) => (
          <div key={s.n} className="mb-16 last:mb-0">
            <StepHeader step={s} />
            <img
              src={s.image}
              alt={`Step ${s.n}: ${s.title}`}
              className="mt-6 w-full object-contain mix-blend-multiply"
            />
            <div className="mt-6 flex justify-end">
              <StepText step={s} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
