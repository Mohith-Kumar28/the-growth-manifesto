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

export function Masthead({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false) // collapsed bar
  const [hasBg, setHasBg] = useState(false) // paper backing visible
  // Set on the client only — the server's clock/timezone may disagree with
  // the visitor's, which would cause a hydration mismatch.
  const [today, setToday] = useState('')
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
  }, [])

  useEffect(() => {
    // Hysteresis: collapse and expand at different scroll positions. With a
    // single threshold, collapsing the masthead shrinks the document (and
    // near the page bottom the browser clamps scrollY back up across the
    // threshold), which immediately re-expands it — an oscillating jiggle.
    const onScroll = () => {
      const y = window.scrollY
      setHasBg((prev) => (prev ? y > 16 : y > 48))
      setScrolled((prev) => (prev ? y > 40 : y > 130))
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
      window.scrollTo({ top: window.scrollY + rect.top - 90, behavior: 'smooth' })
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
    <header
      className={`sticky top-0 z-50 px-4 transition-all duration-500 md:px-6 ${
        hasBg ? 'pt-0' : 'pt-3 md:pt-4'
      }`}
    >
      <div
        className={`relative mx-auto w-full max-w-[1140px] rounded-sm transition-shadow duration-500 ${
          hasBg
            ? dark
              ? 'bg-ink shadow-[0_5px_8.5px_rgba(0,0,0,0.2)]'
              : 'bg-paper-light shadow-[0_5px_8.5px_rgba(0,0,0,0.03)]'
            : ''
        }`}
      >
        <div
          className={`relative z-10 px-6 transition-all duration-500 md:px-10 ${
            scrolled ? 'py-2' : 'pt-6 pb-3 md:pt-7'
          }`}
        >
          {/* Full nameplate — collapses away once scrolled past the hero */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              scrolled ? 'max-h-0 opacity-0' : 'max-h-[220px] opacity-100'
            }`}
          >
            <p
              className={`overflow-hidden text-center font-fell text-[13px] tracking-[0.23em] uppercase sm:text-[15px] md:text-[16px] md:tracking-[3.68px] ${
                dark ? 'text-card-cream' : 'text-black'
              }`}
            >
              Est. 2026&nbsp;&nbsp;·&nbsp;&nbsp;Growth Intelligence for
              Ambitious Operators
            </p>

            <button
              type="button"
              onClick={goHome}
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
                      onClick={() => goToSection(item.id)}
                      className={`whitespace-nowrap transition-colors ${dark ? 'hover:text-brand-gold' : 'hover:text-brand-red'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Collapsed bar — matches the Figma condensed masthead */}
          <div
            className={`grid grid-cols-[1fr_auto_1fr] items-center overflow-hidden transition-all duration-500 ${
              scrolled ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <span
              className={`justify-self-start font-caslon text-[12px] tracking-wide uppercase sm:text-[14px] md:text-[16px] ${
                dark ? 'text-card-cream' : 'text-ink'
              }`}
            >
              {today || ' '}
            </span>

            <button
              type="button"
              onClick={goHome}
              aria-label="The Growth Manifesto — back to home"
              className={`col-span-2 justify-self-end border-y-[3px] border-double px-3 py-0.5 font-chomsky text-[26px] leading-none sm:text-[30px] md:col-span-1 md:justify-self-center md:text-[36px] ${
                dark ? 'border-card-cream/50 text-card-cream' : 'border-ink/70 text-black'
              }`}
            >
              T.G.M.
            </button>

            <nav
              className={`hidden justify-self-end gap-3 font-fell text-[14px] capitalize md:flex md:gap-4 md:text-[16px] ${
                dark ? 'text-gray-body' : 'text-ink-soft'
              }`}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className={`whitespace-nowrap transition-colors ${dark ? 'hover:text-brand-gold' : 'hover:text-brand-red'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
