import { SectionBadge } from './section-badge'
import { Reveal, StopMotion } from './reveal'

type WorkCard = {
  image: string
  stat: string
  heading: React.ReactNode
  headingClass: string
  channels: string
}

const CARDS: Array<WorkCard> = [
  {
    image: '/assets/growth/card-red-full.webp',
    stat: '20M+ organic Reddit views',
    heading: (
      <>
        Pipeline.
        <br />
        Demos. Revenue.
      </>
    ),
    headingClass: 'text-brand-red',
    channels:
      'Reddit Growth · LinkedIn · Distribution · Product · Hunt · Community Acquisition · Enterprise Pipeline',
  },
  {
    image: '/assets/growth/card-gold-full.webp',
    stat: '1B+ TikTok views',
    heading: (
      <>
        Reach.
        <br />
        Virality. Scale.
      </>
    ),
    headingClass: 'text-brand-gold',
    channels:
      'TikTok Organic + Paid · UGC Creator Networks · Influencer Campaigns · Instagram Distribution',
  },
  {
    image: '/assets/growth/card-dark-full.webp',
    stat: '4M+ users onboarded globally across AI + SaaS portfolios',
    heading: <>Sign-ups. Activation. Community.</>,
    headingClass: 'text-ink',
    channels:
      'Reddit Communities · Product Hunt · Founder Distribution · Dev Community · Viral Loop Engineering',
  },
]

function WorkCardItem({ card }: { card: WorkCard }) {
  return (
    <div className="flex w-full max-w-[270px] flex-col">
      <img
        src={card.image}
        alt={card.stat}
        loading="lazy"
        decoding="async"
        className="aspect-[270/300] w-full object-contain"
      />
      <h3
        className={`mt-4 font-fell-eng text-[26px] italic md:text-[32px] ${card.headingClass}`}
      >
        {card.heading}
      </h3>
      <p className="mt-4 font-fell text-[18px] leading-snug text-gray-body md:text-[20px]">
        {card.channels}
      </p>
    </div>
  )
}

export function WorkCards() {
  return (
    <section
      id="our-work"
      className="mx-auto w-full max-w-[1076px] px-6 pt-16 md:px-10 md:pt-20"
    >
      {/* Rule with centered badge */}
      <div className="relative flex justify-center">
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ink/30" />
        <SectionBadge className="relative text-brand-green">
          ◉ Our Works
        </SectionBadge>
      </div>

      {/* Heading row */}
      <Reveal className="mt-8 grid grid-cols-1 gap-4 border-b border-rule pb-5 md:grid-cols-2 md:items-end">
        <h2 className="font-fell text-[28px] italic capitalize text-ink-soft md:text-[40px]">
          Not A Strategy Deck.
          <br />A Running System.
        </h2>
        <p className="font-fell text-[18px] leading-snug text-gray-body md:max-w-[424px] md:justify-self-end md:text-right md:text-[20px]">
          Growth isn&rsquo;t one-size-fits-all. B2B AI, consumer AI, and
          product-led tools each need a different playbook. We run all three.
        </p>
      </Reveal>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-0">
        {CARDS.map((card, i) => (
          <StopMotion
            key={card.stat}
            delay={i * 0.12}
            dx={[-150, 30, 150][i]}
            dy={[70, 180, 90][i]}
            rot={[-16, 12, 18][i]}
            scale={0.72}
            className={`flex justify-center ${
              i > 0 ? 'sm:border-l sm:border-dashed sm:border-rule' : ''
            }`}
          >
            <WorkCardItem card={card} />
          </StopMotion>
        ))}
      </div>
    </section>
  )
}
