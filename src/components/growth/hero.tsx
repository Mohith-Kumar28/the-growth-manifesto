const FACTS = [
  {
    label: 'Fact 1:',
    value: '5B+',
    valueClass: 'text-brand-red',
    description: 'Impressions',
  },
  {
    label: 'Fact 2:',
    value: '10M+',
    valueClass: 'text-brand-gold',
    description: 'Users onboarded globally for AI + SaaS portfolios',
  },
  {
    label: 'Fact 3:',
    value: '2M+',
    valueClass: 'text-brand-green',
    description: 'Revenue added',
  },
]

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1076px] px-6 pt-6 md:px-10">
      <h2 className="text-center font-fell text-[26px] italic capitalize text-ink-soft sm:text-[34px] md:text-[40px]">
        We <span className="text-brand-red">engineer growth</span>. For Startups
        That Refuse To Wait.
      </h2>

      <div className="mt-5 border-t border-ink/70 pt-2.5">
        <div className="aspect-[1076/410] w-full overflow-hidden bg-paper-rect">
          <img
            src="/assets/growth/hero.png"
            alt="A person reading in a chair on a hillside beneath a sky of flowing rainbow light"
            className="h-full w-full object-cover object-[center_32%]"
          />
        </div>
      </div>

      <p className="mt-2.5 font-fell text-[14px] text-gray md:text-[16px]">
        When growth stops being an experiment and starts being a mandate:
        companies call us.
      </p>

      <div className="mt-4 border-t border-ink/70">
        <dl className="grid grid-cols-1 gap-x-[119px] gap-y-8 border-b border-ink-soft/70 pt-4 pb-2.5 sm:grid-cols-3">
          {FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-2">
              <dt className="font-caslon text-[18px] text-gray md:text-[20px]">
                {fact.label}
              </dt>
              <dd
                className={`font-caslon text-[52px] leading-none md:text-[64px] ${fact.valueClass}`}
              >
                {fact.value}
              </dd>
              <p className="font-fell text-[14px] text-gray md:text-[16px]">
                {fact.description}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
