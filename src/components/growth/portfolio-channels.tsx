import { Reveal } from './reveal'

const CLIENTS = [
  { name: 'Drizz', image: '/assets/growth/stamp-drizz.webp' },
  { name: 'Merlin', image: '/assets/growth/stamp-merlin.webp' },
  { name: 'rocket', image: '/assets/growth/stamp-rocket.webp' },
  { name: 'Finlens', image: '/assets/growth/stamp-finlens.webp' },
  { name: 'SABER', image: '/assets/growth/stamp-saber.webp' },
  { name: 'GM Markets', image: '/assets/growth/stamp-gmmarkets.webp' },
]

const CHANNELS = [
  { name: 'Reddit', image: '/assets/growth/channel-reddit.webp' },
  { name: 'TikTok', image: '/assets/growth/channel-tiktok.webp' },
  { name: 'X', image: '/assets/growth/channel-x.webp' },
  { name: 'LinkedIn', image: '/assets/growth/channel-linkedin.webp' },
  { name: 'Product Hunt', image: '/assets/growth/channel-producthunt.webp' },
]

export function PortfolioAndChannels() {
  return (
    <section
      id="our-work"
      className="mx-auto w-full max-w-[1076px] px-6 pt-16 md:px-10 md:pt-20"
    >
      <Reveal>
        <h2 className="font-fell text-[26px] italic capitalize text-ink-soft md:text-[36px]">
          Chapters We&rsquo;ve Written.
        </h2>
        <p className="mt-1.5 font-fell text-[16px] text-gray-body md:text-[18px]">
          The founders, startups, and teams we&rsquo;ve helped grow.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6"
      >
        {CLIENTS.map((client) => (
          <img
            key={client.name}
            src={client.image}
            alt={client.name}
            loading="lazy"
            decoding="async"
            className="aspect-[510/359] w-full object-contain"
          />
        ))}
      </Reveal>

      <Reveal className="mt-16 md:mt-20">
        <h2 className="font-fell text-[26px] italic capitalize text-ink-soft md:text-[36px]">
          The Distribution Desk.
        </h2>
        <p className="mt-1.5 font-fell text-[16px] text-gray-body md:text-[18px]">
          The channels we activate.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5"
      >
        {CHANNELS.map((channel) => (
          <img
            key={channel.name}
            src={channel.image}
            alt={channel.name}
            loading="lazy"
            decoding="async"
            className="aspect-[200/270] w-full rounded-md object-cover"
          />
        ))}
      </Reveal>
    </section>
  )
}
