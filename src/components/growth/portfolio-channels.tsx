import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal } from './reveal'
import { NextStoryBanner } from './next-story-banner'

/** Client stamps, in the order they run across the design's marquee. */
const CLIENTS = [
  { name: 'Drizz', image: '/assets/growth/stamp-drizz.webp' },
  { name: 'Merlin', image: '/assets/growth/stamp-merlin.webp' },
  { name: 'rocket', image: '/assets/growth/stamp-rocket.webp' },
  { name: 'cruva', image: '/assets/growth/stamp-cruva.webp' },
  {
    name: 'Reserved for your company',
    image: '/assets/growth/stamp-reserved.webp',
  },
  { name: 'Finlens', image: '/assets/growth/stamp-finlens.webp' },
  { name: 'Ultrahuman', image: '/assets/growth/stamp-ultrahuman.webp' },
  { name: 'SABER', image: '/assets/growth/stamp-saber.webp' },
  { name: 'GM Markets', image: '/assets/growth/stamp-gmmarkets.webp' },
  { name: 'august', image: '/assets/growth/stamp-august.webp' },
  { name: 'Astrotalk', image: '/assets/growth/stamp-astrotalk.webp' },
  { name: 'JK Index', image: '/assets/growth/stamp-jkindex.webp' },
  { name: 'aurorax', image: '/assets/growth/stamp-aurorax.webp' },
]

type Channel = {
  name: string
  /** Portrait logo-only card shown while the deck is at rest. */
  image: string
  /** Landscape stats card exported from the design, revealed on hover/tap. */
  expanded: string
  /** The card's own fill, reused by the selected-thumbnail underline. */
  accent: string
}

const CHANNELS: Array<Channel> = [
  {
    name: 'Reddit',
    image: '/assets/growth/channel-reddit.webp',
    expanded: '/assets/growth/channel-reddit-expanded.webp',
    accent: 'bg-brand-red',
  },
  {
    name: 'Influencer marketing',
    image: '/assets/growth/channel-tiktok.webp',
    expanded: '/assets/growth/channel-influencer-expanded.webp',
    accent: 'bg-brand-gold',
  },
  {
    name: 'X + LinkedIn',
    image: '/assets/growth/channel-x.webp',
    expanded: '/assets/growth/channel-x-linkedin-expanded.webp',
    accent: 'bg-ink',
  },
  {
    // TODO: mismatch inherited from the design. The expanded card here is
    // TikTok Shop, but the collapsed row (Figma 267:108) still carries the old
    // LinkedIn art for this slot — LinkedIn itself moved up into "X + LinkedIn".
    // Needs a TikTok Shop portrait card drawn in Figma before this resolves.
    name: 'TikTok Shop',
    image: '/assets/growth/channel-linkedin.webp',
    expanded: '/assets/growth/channel-tiktok-shop-expanded.webp',
    accent: 'bg-brand-green',
  },
  {
    name: 'ProductHunt',
    image: '/assets/growth/channel-producthunt.webp',
    expanded: '/assets/growth/channel-producthunt-expanded.webp',
    accent: 'bg-brand-blue',
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

      <Reveal delay={0.1} className="mt-8">
        {/* Infinite horizontal scroll; edges fade to page bg via mask */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]">
          <div className="tgm-marquee-track flex w-max gap-2.5">
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <img
                key={`${client.name}-${i}`}
                src={client.image}
                alt={client.name}
                aria-hidden={i >= CLIENTS.length}
                loading="lazy"
                decoding="async"
                className="aspect-[522/374] w-[150px] shrink-0 object-contain md:w-[190px]"
              />
            ))}
          </div>
        </div>
      </Reveal>

      <NextStoryBanner />

      <Reveal className="mt-16 md:mt-20">
        <h2 className="font-fell text-[26px] italic capitalize text-ink-soft md:text-[36px]">
          The Distribution Desk.
        </h2>
        <p className="mt-1.5 font-fell text-[16px] text-gray-body md:text-[18px]">
          The channels we activate.
        </p>
      </Reveal>

      {/* Desktop: hover a card to expand it into a wide landscape card,
          compressing its neighbours. Only from lg up — below that there isn't
          enough width for the expanded card's stats to stay legible. */}
      <Reveal delay={0.1} className="mt-8 hidden lg:block">
        <DesktopChannelDeck />
      </Reveal>

      {/* Below lg: selected expanded card on top, tappable thumbnail strip below */}
      <Reveal delay={0.1} className="mt-8 lg:hidden">
        <CompactChannelDeck />
      </Reveal>
    </section>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Width morph. Springs so a mouse sweeping across the deck blends into the
    next card instead of restarting. Collapse is quicker than expand so the
    portrait logo isn't visible inside a still-wide box on the way back. */
const EXPAND_SPRING = {
  type: 'spring',
  visualDuration: 0.6,
  bounce: 0.15,
} as const
const COLLAPSE_SPRING = {
  type: 'spring',
  visualDuration: 0.45,
  bounce: 0,
} as const

function DesktopChannelDeck() {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <div className="flex h-[270px] gap-5" onMouseLeave={() => setHovered(null)}>
      {CHANNELS.map((channel, i) => {
        const isOpen = hovered === i

        return (
          <motion.div
            key={channel.name}
            className="relative min-w-0 basis-0 cursor-pointer overflow-hidden"
            style={{ flexGrow: 1 }}
            initial={false}
            animate={{ flexGrow: isOpen ? 3.5 : 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : isOpen
                  ? EXPAND_SPRING
                  : COLLAPSE_SPRING
            }
            onMouseEnter={() => setHovered(i)}
          >
            {/* Collapsed: logo-only card */}
            <motion.img
              src={channel.image}
              alt={channel.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : isOpen
                    ? { duration: 0.22, ease: 'easeOut' }
                    : // Held back until the card is narrow again — this art is
                      // portrait, so it crops badly in a wide box.
                      { duration: 0.32, delay: 0.18, ease: 'easeOut' }
              }
            />

            {/* Expanded: the design's landscape stats card. Anchored left so the
                logo stays put as the card widens, and contained so the stats on
                the right edge are never clipped. */}
            <motion.img
              src={channel.expanded}
              alt={`${channel.name} channel results`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-left"
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : isOpen
                    ? // Delayed so the stats land as the width settles, rather
                      // than reading as clipped inside a still-narrow card.
                      { duration: 0.42, delay: 0.14, ease: 'easeOut' }
                    : { duration: 0.2, ease: 'easeIn' }
              }
              aria-hidden={!isOpen}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

function CompactChannelDeck() {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.img
          key={CHANNELS[selected].name}
          src={CHANNELS[selected].expanded}
          alt={`${CHANNELS[selected].name} channel results`}
          decoding="async"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="aspect-[1329/834] w-full object-contain"
        />
      </AnimatePresence>

      <div className="mx-auto mt-6 grid max-w-[420px] grid-cols-5 gap-2.5">
        {CHANNELS.map((channel, i) => (
          <button
            key={channel.name}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Show ${channel.name} results`}
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
                className={`absolute -bottom-0.5 left-1/2 h-0.5 w-[49px] max-w-[90%] -translate-x-1/2 ${channel.accent}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
