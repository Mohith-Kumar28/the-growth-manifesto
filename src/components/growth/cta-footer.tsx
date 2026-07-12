import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ConfessionCard } from './confession-card'
import { addLead } from '#/server/db'

const SOCIALS = [
  { icon: '/assets/growth/icon-linkedin.svg', label: 'LinkedIn', href: '#' },
  { icon: '/assets/growth/icon-email.svg', label: 'Email', href: '#' },
  { icon: '/assets/growth/icon-twitter.svg', label: 'Twitter', href: '#' },
]

type TabKey = 'founders' | 'vc'

const TABS: Record<
  TabKey,
  {
    label: string
    heading: string
    subline: string
    button: string
    underline: string
    accentText: string
    accentBg: string
    accentBorder: string
  }
> = {
  founders: {
    label: 'For Founders',
    heading: 'Building an AI company that needs to own the US market?',
    subline:
      'We work with a small number of companies at any one time. Selective, deliberate, and unapologetic about it.',
    button: 'Submit the case',
    underline: '/assets/growth/tab-underline.svg',
    accentText: 'text-brand-gold',
    accentBg: 'bg-brand-gold',
    accentBorder: 'focus:border-brand-gold',
  },
  vc: {
    label: 'For VC Firms',
    heading: 'Running a VC portfolio with AI companies ready to scale?',
    subline:
      'Portfolio partnerships available for firms with multiple companies that need the same distribution infrastructure.',
    button: 'Explore a Portfolio Partnership',
    underline: '/assets/growth/tab-underline-green.svg',
    accentText: 'text-brand-green',
    accentBg: 'bg-brand-green',
    accentBorder: 'focus:border-brand-green',
  },
}

function Field({
  label,
  type = 'text',
  accent,
  name,
}: {
  label: string
  type?: string
  accent: string
  name: string
}) {
  return (
    <label className="block text-left">
      <span className="font-caslon text-[12px] tracking-wide text-card-cream/60 uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        className={`mt-1 w-full border-b border-card-cream/30 bg-transparent pb-2 font-fell text-[16px] text-card-cream outline-none transition-colors placeholder:text-card-cream/30 ${accent}`}
      />
    </label>
  )
}

export function CtaFooter() {
  const [tab, setTab] = useState<TabKey>('founders')
  const [sent, setSent] = useState(false)
  const mountedAt = useRef(0)
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])
  const t = TABS[tab]

  return (
    <section className="mx-auto w-full max-w-[1140px] px-6 pt-24 pb-16 md:px-10 md:pt-32">
      <div className="relative overflow-hidden rounded-sm bg-ink px-6 pt-14 pb-[46%] md:px-16 md:pt-20 md:pb-[26%]">
        {/* tabs */}
        <div className="flex items-center justify-center gap-6">
          {(Object.keys(TABS) as Array<TabKey>).map((key) => {
            const isActive = key === tab
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="relative pb-2"
              >
                <span
                  className={`font-caslon text-[22px] transition-colors duration-300 md:text-[24px] ${
                    isActive ? TABS[key].accentText : 'text-gray-body'
                  }`}
                >
                  {TABS[key].label}
                </span>
                {isActive && (
                  <motion.img
                    layoutId="tab-underline"
                    src={TABS[key].underline}
                    alt=""
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-[6px] w-[150px] max-w-[120%] -translate-x-1/2"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* heading + subline (crossfade on tab change) */}
        <div className="mx-auto mt-14 min-h-[130px] max-w-[743px] text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-fell text-[26px] italic text-card-cream md:text-[33.7px]">
                {t.heading}
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] font-fell text-[15px] leading-[1.65] text-card-cream md:text-[16px]">
                {t.subline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* form */}
        <div className="mx-auto mt-10 max-w-[620px]">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.p
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-card-cream/30 pt-10 text-center font-fell text-[18px] italic text-card-cream"
              >
                Thank you — we&rsquo;ll be in touch shortly.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  setSent(true)
                  addLead({
                    data: {
                      name: String(fd.get('name') ?? ''),
                      email: String(fd.get('email') ?? ''),
                      message: String(fd.get('message') ?? ''),
                      audience: tab,
                      hp: String(fd.get('company') ?? ''),
                      elapsed: Date.now() - mountedAt.current,
                    },
                  }).catch(() => {})
                }}
              >
                {/* honeypot */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" name="name" accent={t.accentBorder} />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    accent={t.accentBorder}
                  />
                </div>
                <div className="mt-6">
                  <Field
                    name="message"
                    label={
                      tab === 'founders'
                        ? 'What are you building?'
                        : 'Tell us about your portfolio'
                    }
                    accent={t.accentBorder}
                  />
                </div>
                <div className="mt-9 flex justify-center">
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 px-8 py-3.5 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90 ${t.accentBg}`}
                  >
                    {t.button}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* bottom bar: confessions link stays centered above the postcard;
            socials + monogram drop to the bottom corners, flanking it (md+) */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-y-12 md:mt-44 md:justify-center">
          <div className="flex flex-col items-start gap-4 md:absolute md:bottom-12 md:left-16 md:flex-row md:items-center md:gap-5">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                <img src={s.icon} alt={s.label} className="h-8 w-8" />
              </a>
            ))}
          </div>

          <img
            src="/assets/growth/tgm-logo.svg"
            alt="The Growth Manifesto — T.G.M. monogram"
            className="h-auto w-[140px] md:absolute md:bottom-12 md:right-16 md:w-[172px]"
          />

          <Link
            to="/confessions"
            className="order-last w-full text-center font-caslon text-[14px] whitespace-nowrap text-brand-gold underline-offset-4 transition-opacity hover:opacity-70 hover:underline md:order-none md:w-auto md:text-[15px]"
          >
            View all confessions →
          </Link>
        </div>

        <ConfessionCard />
      </div>
    </section>
  )
}
