import { useEffect, useState } from 'react'
import { scrollToId } from './smooth-scroll'

const NAV_ITEMS = [
  { label: 'The Problem', id: 'problem' },
  { label: 'Who We Work With', id: 'work-with' },
  { label: 'Our Work', id: 'our-work' },
]

export function Masthead() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 px-4 transition-all duration-500 md:px-6 ${
        scrolled ? 'pt-2' : 'pt-3 md:pt-4'
      }`}
    >
      {/* Displacement filter that gives the paper its ragged, burnt edge. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="tgm-burnt-edge" x="-6%" y="-20%" width="112%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.022"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        className={`relative mx-auto w-full max-w-[1140px] transition-shadow duration-500 ${
          scrolled ? 'burnt-shadow' : ''
        }`}
      >
        {/* Opaque burnt-paper background layer (behind the text). */}
        <div className="burnt-bg" aria-hidden />

        <div
          className={`relative z-10 px-6 transition-all duration-500 md:px-10 ${
            scrolled ? 'py-2' : 'pt-6 pb-3 md:pt-7'
          }`}
        >
          <p
            className={`overflow-hidden text-center font-fell tracking-[0.23em] text-black uppercase transition-all duration-500 md:tracking-[3.68px] ${
              scrolled
                ? 'max-h-0 text-[0px] opacity-0'
                : 'max-h-8 text-[13px] opacity-100 sm:text-[15px] md:text-[16px]'
            }`}
          >
            Est. 2025&nbsp;&nbsp;·&nbsp;&nbsp;Growth Intelligence for Ambitious
            Operators
          </p>

          <button
            type="button"
            onClick={() => scrollToId('top')}
            className={`block w-full text-center font-chomsky leading-none text-black transition-all duration-500 ${
              scrolled
                ? 'text-[24px] sm:text-[30px] md:text-[34px]'
                : 'mt-2 text-[22px] min-[400px]:text-[28px] sm:text-[46px] md:text-[62px] lg:text-[75px]'
            }`}
          >
            The Growth Manifesto
          </button>

          <div
            className={`border-y border-ink/80 transition-all duration-500 ${
              scrolled ? 'mt-2 py-0.5' : 'mt-4 py-1 md:mt-5'
            }`}
          >
            <div className="grid grid-cols-2 items-center gap-y-1 font-caslon text-[11px] uppercase sm:grid-cols-3 md:text-[16px]">
              <span className="text-left text-ink-soft">
                Vol. I&nbsp;&nbsp;·&nbsp;&nbsp;Issue 1
              </span>
              <span className="text-right text-ink normal-case sm:text-center">
                Monday, April 13, 2026
              </span>
              <nav className="hidden justify-end gap-3 text-right font-fell text-ink-soft capitalize sm:flex md:gap-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => scrollToId(item.id)}
                    className="whitespace-nowrap transition-colors hover:text-brand-red"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
