import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { scrollToId } from './smooth-scroll'

const NAV_ITEMS = [
  { label: 'The Problem', id: 'problem' },
  { label: 'Who We Work With', id: 'work-with' },
  { label: 'Our Work', id: 'our-work' },
]

// Set by goToSection when the target section only exists on '/'; consumed
// once the homepage has mounted and can actually scroll to it.
const PENDING_SCROLL_KEY = 'tgm-pending-scroll'

const EASE =
  'duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0'

type CardProps = {
  dark: boolean
  today: string
  /** e.g. "Sep 27, 2026" — the collapsed bar's date on phones. */
  todayShort: string
  /** Condensed (T.G.M. bar) instead of the full nameplate. */
  scrolled: boolean
  /** Paper backing + shadow behind the card. */
  hasBg: boolean
  onHome?: () => void
  onSection?: (id: string) => void
}

/**
 * The masthead itself. Rendered twice: once invisibly in flow to reserve a
 * constant height, once for real on top of that — see `Masthead` below.
 */
function MastheadCard({
  dark,
  today,
  todayShort,
  scrolled,
  hasBg,
  onHome,
  onSection,
}: CardProps) {
  return (
    <div
      className={`px-4 transition-[padding] md:px-6 ${EASE} ${
        hasBg ? 'pt-0' : 'pt-3 md:pt-4'
      }`}
    >
      <div
        className={`relative mx-auto w-full max-w-[1140px] rounded-sm transition-[background-color,box-shadow] ${EASE} ${
          hasBg
            ? dark
              ? 'bg-ink shadow-[0_5px_8.5px_rgba(0,0,0,0.2)]'
              : 'bg-paper-light shadow-[0_5px_8.5px_rgba(0,0,0,0.03)]'
            : 'bg-transparent shadow-none'
        }`}
      >
        <div
          className={`relative z-10 px-6 transition-[padding] md:px-10 ${EASE} ${
            scrolled ? 'py-2' : 'pt-6 pb-3 md:pt-7'
          }`}
        >
          {/* Full nameplate — collapses away once scrolled past the hero.
              The 1fr→0fr grid row animates to the content's real height, so
              the shrink has no dead travel the way a max-height would. */}
          <div
            className={`grid transition-[grid-template-rows,opacity] ${EASE} ${
              scrolled
                ? 'grid-rows-[0fr] opacity-0'
                : 'grid-rows-[1fr] opacity-100'
            }`}
          >
            <div className="overflow-hidden">
              <p
                className={`text-center font-fell text-[13px] tracking-[0.23em] uppercase sm:text-[15px] md:text-[16px] md:tracking-[3.68px] ${
                  dark ? 'text-card-cream' : 'text-black'
                }`}
              >
                Est. 2026&nbsp;&nbsp;·&nbsp;&nbsp;Growth Intelligence for
                Ambitious Operators
              </p>

              <button
                type="button"
                onClick={onHome}
                className={`mt-2 block w-full text-center font-chomsky text-[22px] leading-none min-[400px]:text-[28px] sm:text-[46px] md:text-[62px] lg:text-[75px] ${
                  dark ? 'text-card-cream' : 'text-black'
                }`}
              >
                The Growth Manifesto
              </button>

              <div
                className={`mt-4 border-y py-1 md:mt-5 ${dark ? 'border-card-cream/40' : 'border-ink/80'}`}
              >
                <div className="grid grid-cols-2 items-center gap-y-1 font-caslon text-[11px] uppercase sm:grid-cols-3 md:text-[16px]">
                  <span
                    className={`text-left ${dark ? 'text-gray-body' : 'text-ink-soft'}`}
                  >
                    Vol. I&nbsp;&nbsp;·&nbsp;&nbsp;Issue 1
                  </span>
                  <span
                    className={`text-right normal-case sm:text-center ${dark ? 'text-card-cream' : 'text-ink'}`}
                  >
                    {today || ' '}
                  </span>
                  <nav
                    className={`hidden justify-end gap-3 text-right font-fell capitalize sm:flex md:gap-4 ${
                      dark ? 'text-gray-body' : 'text-ink-soft'
                    }`}
                  >
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => onSection?.(item.id)}
                        className={`whitespace-nowrap transition-colors ${dark ? 'hover:text-brand-gold' : 'hover:text-brand-red'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsed bar — matches the Figma condensed masthead */}
          <div
            className={`grid transition-[grid-template-rows,opacity] ${EASE} ${
              scrolled
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <span
                  className={`justify-self-start font-caslon text-[12px] tracking-wide whitespace-nowrap uppercase sm:text-[14px] md:text-[16px] ${
                    dark ? 'text-card-cream' : 'text-ink'
                  }`}
                >
                  {/* The full date wraps to three lines beside T.G.M. on a
                      phone. */}
                  <span className="sm:hidden">{todayShort || ' '}</span>
                  <span className="hidden sm:inline">{today || ' '}</span>
                </span>

                <button
                  type="button"
                  onClick={onHome}
                  aria-label="The Growth Manifesto — back to home"
                  className={`justify-self-center border-y-[3px] border-double px-3 py-0.5 font-chomsky text-[26px] leading-none sm:text-[30px] md:text-[36px] ${
                    dark
                      ? 'border-card-cream/50 text-card-cream'
                      : 'border-ink/70 text-black'
                  }`}
                >
                  T.G.M.
                </button>

                {/* Right column: the nav links, lg+ only. */}
                <div className="justify-self-end">
                  {/* Desktop nav — lg+ only */}
                  <nav
                    className={`hidden gap-3 font-fell text-[14px] capitalize md:gap-4 md:text-[16px] lg:flex ${
                      dark ? 'text-gray-body' : 'text-ink-soft'
                    }`}
                  >
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => onSection?.(item.id)}
                        className={`whitespace-nowrap transition-colors ${dark ? 'hover:text-brand-gold' : 'hover:text-brand-red'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Masthead({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false) // collapsed bar
  const [hasBg, setHasBg] = useState(false) // paper backing visible
  // Set on the client only — the server's clock/timezone may disagree with
  // the visitor's, which would cause a hydration mismatch.
  const [today, setToday] = useState('')
  const [todayShort, setTodayShort] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
    setTodayShort(
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    )
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHasBg((prev) => (prev ? y > 8 : y > 32))
      setScrolled((prev) => (prev ? y > 100 : y > 140))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Consume a pending cross-page scroll once we've landed on the homepage.
  // The router flips `pathname` to '/' slightly before the new page's DOM
  // (and its target section) actually mounts, so retry until the element
  // shows up instead of firing once and giving up. Scrolls with plain
  // `window.scrollTo` rather than `scrollToId`/Lenis — the freshly mounted
  // Lenis instance from the new page hasn't measured the document yet at
  // this point and silently no-ops.
  useEffect(() => {
    if (pathname !== '/') return
    const pending = sessionStorage.getItem(PENDING_SCROLL_KEY)
    if (!pending) return
    let cancelled = false
    let attempts = 0
    const scrollNow = (id: string) => {
      const el = document.getElementById(id)
      if (!el) return
      const rect = el.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + rect.top - 90,
        behavior: 'smooth',
      })
    }
    const tryScroll = () => {
      if (cancelled) return
      if (document.getElementById(pending)) {
        sessionStorage.removeItem(PENDING_SCROLL_KEY)
        scrollNow(pending)
        // Reassert once layout/scroll-restoration has settled, in case
        // something reset the scroll position right after this fired. Not
        // gated on `cancelled` — once we've claimed the pending scroll we
        // see it through, even if this effect instance itself unmounts
        // (e.g. React's dev-mode double-invoke of a fresh mount's effects).
        setTimeout(() => scrollNow(pending), 300)
        return
      }
      if (attempts++ < 40) setTimeout(tryScroll, 50)
    }
    tryScroll()
    return () => {
      cancelled = true
    }
  }, [pathname])

  const goToSection = (id: string) => {
    if (pathname === '/') {
      scrollToId(id)
    } else {
      sessionStorage.setItem(PENDING_SCROLL_KEY, id)
      navigate({ to: '/' })
    }
  }

  const goHome = () => {
    if (pathname === '/') scrollToId('top')
    else navigate({ to: '/' })
  }

  return (
    // `pointer-events-none` because the header keeps its full expanded height
    // even while condensed; the live card re-enables them for itself so the
    // leftover band doesn't swallow clicks on the page underneath.
    <header className="pointer-events-none sticky top-0 z-50">
      {/* Height keeper. The masthead's *flow* height must never change: it is
          the first element in the document, so collapsing it shortens the
          page, and the browser's scroll anchoring compensates by pulling
          scrollY back by the same amount — the very value that decides
          whether to collapse. That fed straight back into an
          expand/collapse/expand loop on slow scrolls (no hysteresis band can
          cover it: the jump is larger than the whole band). So the expanded
          card is rendered once, invisibly, purely to reserve a constant
          height, and the real one is overlaid on top of it. */}
      <div className="invisible" aria-hidden inert>
        <MastheadCard
          dark={dark}
          today={today}
          todayShort={todayShort}
          scrolled={false}
          hasBg={false}
        />
      </div>

      <div className="pointer-events-auto absolute inset-x-0 top-0">
        <MastheadCard
          dark={dark}
          today={today}
          todayShort={todayShort}
          scrolled={scrolled}
          hasBg={hasBg}
          onHome={goHome}
          onSection={goToSection}
        />
      </div>
    </header>
  )
}
