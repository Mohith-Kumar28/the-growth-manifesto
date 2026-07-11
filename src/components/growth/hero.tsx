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
            src="/assets/growth/hero.png"
            alt="A person reading in a chair on a hillside beneath a sky of flowing rainbow light"
            className="h-full w-full object-cover object-[center_32%]"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-2.5 font-fell text-[14px] text-gray md:text-[16px]">
          When growth stops being an experiment and starts being a mandate:
          companies call us.
        </p>
      </Reveal>

      {/* By the numbers — newspaper stat block with column rules */}
      <div className="mt-12 md:mt-16">
        <Reveal className="flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/20" />
          <p className="font-caslon text-[12px] tracking-[0.3em] whitespace-nowrap text-gray uppercase md:text-[13px]">
            By The Numbers
          </p>
          <span className="h-px flex-1 bg-ink/20" />
        </Reveal>

        <dl className="mt-9 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {FACTS.map((fact, i) => (
            <Reveal
              key={fact.kicker}
              delay={i * 0.1}
              className="flex flex-col items-center px-4 text-center"
            >
              <dt className="font-caslon text-[12px] tracking-[0.22em] text-gray/70 uppercase">
                {fact.kicker}
              </dt>
              <dd
                className={`mt-1.5 font-caslon text-[56px] leading-none md:text-[68px] ${fact.valueClass}`}
              >
                {fact.value}
              </dd>
              <p className="mt-2 max-w-[240px] font-fell text-[15px] leading-snug text-gray md:text-[16px]">
                {fact.description}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
