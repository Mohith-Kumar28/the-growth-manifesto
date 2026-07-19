import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  {
    name: 'Reddit',
    image: '/assets/growth/channel-reddit.webp',
    detail: '/assets/growth/channel-reddit-detail.webp',
  },
  {
    name: 'TikTok',
    image: '/assets/growth/channel-tiktok.webp',
    detail: '/assets/growth/channel-tiktok-detail.webp',
  },
  {
    name: 'X',
    image: '/assets/growth/channel-x.webp',
    detail: '/assets/growth/channel-x-detail.webp',
  },
  {
    name: 'LinkedIn',
    image: '/assets/growth/channel-linkedin.webp',
    detail: '/assets/growth/channel-linkedin-detail.webp',
  },
  {
    name: 'Product Hunt',
    image: '/assets/growth/channel-producthunt.webp',
    detail: '/assets/growth/channel-producthunt-detail.webp',
  },
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

      {/* Desktop: simple card that crossfades into the detailed card on hover */}
      <Reveal delay={0.1} className="mt-8 hidden gap-5 md:grid md:grid-cols-5">
        {CHANNELS.map((channel) => (
          <div key={channel.name} className="group relative">
            <img
              src={channel.image}
              alt={channel.name}
              loading="lazy"
              decoding="async"
              className="aspect-[200/270] w-full rounded-md object-cover transition-opacity duration-300 ease-out group-hover:opacity-0"
            />
            <img
              src={channel.detail}
              alt={`${channel.name} channel stats`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 aspect-[200/270] w-full rounded-md object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          </div>
        ))}
      </Reveal>

      {/* Mobile: selected detailed card on top, tappable thumbnail strip below */}
      <Reveal delay={0.1} className="mt-8 md:hidden">
        <MobileChannelDeck />
      </Reveal>
    </section>
  )
}

function MobileChannelDeck() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="mx-auto max-w-[315px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={CHANNELS[selected].name}
          src={CHANNELS[selected].detail}
          alt={`${CHANNELS[selected].name} channel stats`}
          decoding="async"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto aspect-[200/270] w-[200px] rounded-md object-cover"
        />
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-5 gap-2.5">
        {CHANNELS.map((channel, i) => (
          <button
            key={channel.name}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Show ${channel.name} stats`}
            aria-pressed={i === selected}
            className="relative pb-2"
          >
            <img
              src={channel.image}
              alt={channel.name}
              loading="lazy"
              decoding="async"
              className="aspect-[55/81] w-full rounded object-cover"
            />
            {i === selected && (
              <motion.div
                layoutId="channel-underline"
                className="absolute -bottom-0.5 left-1/2 h-0.5 w-[49px] max-w-[90%] -translate-x-1/2 bg-brand-red"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
