const NAV_ITEMS = [
  { label: 'The Problem', href: '#problem' },
  { label: 'Who We Work With', href: '#work-with' },
  { label: 'Our Work', href: '#our-work' },
]

export function Masthead() {
  return (
    <header className="mx-auto w-full max-w-[1140px] px-6 pt-10 pb-4 md:px-10 md:pt-12">
      <p className="text-center font-fell text-[13px] tracking-[0.23em] text-black uppercase sm:text-[15px] md:text-[16px] md:tracking-[3.68px]">
        Est. 2025&nbsp;&nbsp;·&nbsp;&nbsp;Growth Intelligence for Ambitious
        Operators
      </p>

      <h1 className="mt-2 text-center font-chomsky text-[22px] leading-none text-black min-[400px]:text-[28px] sm:text-[46px] md:text-[62px] lg:text-[75px]">
        The Growth Manifesto
      </h1>

      <div className="mt-4 border-y border-ink/80 py-1 md:mt-5">
        <div className="grid grid-cols-2 items-center gap-y-1 font-caslon text-[11px] uppercase sm:grid-cols-3 md:text-[16px]">
          <span className="text-left text-ink-soft">
            Vol. I&nbsp;&nbsp;·&nbsp;&nbsp;Issue 1
          </span>
          <span className="text-right text-ink normal-case sm:text-center">
            Monday, April 13, 2026
          </span>
          <nav className="hidden justify-end gap-3 text-right font-fell text-ink-soft capitalize sm:flex md:gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-brand-red"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
