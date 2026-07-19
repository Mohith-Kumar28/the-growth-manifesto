import { motion } from 'framer-motion'
import { Reveal } from './reveal'

const FACTS = [
  {
    kicker: 'Fact 01',
    value: '5B+',
    valueClass: 'text-brand-red',
    description: 'Impressions',
  },
  {
    kicker: 'Fact 02',
    value: '10M+',
    valueClass: 'text-brand-gold',
    description: 'Users onboarded globally for AI + SaaS portfolios',
  },
  {
    kicker: 'Fact 03',
    value: '2M+',
    valueClass: 'text-brand-green',
    description: 'Revenue added',
  },
  {
    kicker: 'Fact 04',
    value: '98%',
    valueClass: 'text-brand-gold',
    description: 'Users onboarded globally for AI + SaaS portfolios',
  },
]

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1076px] px-6 pt-8 md:px-10">
      <Reveal>
        <h2 className="text-center font-fell text-[26px] italic capitalize text-ink-soft sm:text-[34px] md:text-[40px]">
          We <span className="text-brand-red">engineer growth</span>. For
          Startups That Refuse To Wait.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-5 border-t border-ink/70 pt-2.5">
        <div className="aspect-[1076/410] w-full overflow-hidden bg-paper-rect">
          <motion.img
            src="/assets/growth/hero.webp"
            alt="A person reading in a chair on a hillside beneath swirling clouds, rendered in halftone black and white"
            width={1076}
            height={410}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[center_32%]"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Reveal>

      {/* No Reveal here — below the fold's whileInView margin on tall
          viewports, so it stayed invisible until the first scroll. */}
      <p className="mt-2.5 font-fell text-[14px] text-gray md:text-[16px]">
        When growth stops being an experiment and starts being a mandate:
        companies call us.
      </p>

      {/* By the numbers — newspaper stat block. The hairline above plus the
          stat row's own top border read as a double rule; the row's bottom
          border alone reads as a single rule, matching the Figma source. */}
      <div className="mt-12 md:mt-16">
        <div className="h-px w-full bg-ink-soft/60" />

        <dl className="mt-1 grid grid-cols-1 gap-x-6 gap-y-10 border-y border-ink-soft/60 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact, i) => (
            <Reveal
              key={fact.kicker}
              delay={i * 0.1}
              className="flex flex-col items-start gap-2 text-left"
            >
              <dt className="font-caslon text-[18px] text-gray">
                {fact.kicker}:
              </dt>
              <dd
                className={`font-caslon text-[48px] leading-none md:text-[64px] ${fact.valueClass}`}
              >
                {fact.value}
              </dd>
              <p className="max-w-[240px] font-fell text-[15px] leading-snug text-gray md:text-[16px]">
                {fact.description}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
