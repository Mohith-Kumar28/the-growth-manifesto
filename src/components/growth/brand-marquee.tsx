import type { ReactNode } from 'react'

/* Dummy monochrome wordmarks — swap for real client logos later. */
type Brand = { name: string; icon: ReactNode; className: string }

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
    <path d={d} fill="currentColor" />
  </svg>
)

const BRANDS: Array<Brand> = [
  {
    name: 'NORTHWIND',
    icon: <Icon d="M12 2 22 20H2z" />,
    className: 'font-caslon text-[22px] tracking-[0.15em] uppercase',
  },
  {
    name: 'Vellum',
    icon: (
      <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 110 10 5 5 0 010-10z" />
    ),
    className: 'font-fell text-[26px] italic',
  },
  {
    name: 'AXIOM AI',
    icon: <Icon d="M4 4h16v16H4z" />,
    className: 'font-caslon text-[22px] tracking-[0.25em] uppercase',
  },
  {
    name: 'Hearth',
    icon: <Icon d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />,
    className: 'font-fell-eng text-[26px] italic',
  },
  {
    name: 'QUANTA',
    icon: <Icon d="M12 2l10 10-10 10L2 12z" />,
    className: 'font-caslon text-[22px] tracking-[0.2em] uppercase',
  },
  {
    name: 'Lumen Labs',
    icon: <Icon d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />,
    className: 'font-fell text-[25px]',
  },
  {
    name: 'MERIDIAN',
    icon: <Icon d="M12 3l9 9-9 9-9-9z" />,
    className: 'font-caslon text-[21px] tracking-[0.22em] uppercase',
  },
  {
    name: 'Cinder & Co.',
    icon: <Icon d="M6 6h12v12H6zM10 2h4v4h-4z" />,
    className: 'font-fell-eng text-[25px] italic',
  },
]

function LogoRow() {
  return (
    <ul className="flex shrink-0 items-center gap-16 px-8">
      {BRANDS.map((b) => (
        <li
          key={b.name}
          className="flex items-center gap-2.5 whitespace-nowrap text-ink/70 transition-opacity duration-300 hover:text-ink"
        >
          {b.icon}
          <span className={b.className}>{b.name}</span>
        </li>
      ))}
    </ul>
  )
}

export function BrandMarquee() {
  return (
    <section
      aria-label="Featured in"
      className="mx-auto mt-16 w-full max-w-[1076px] px-6 md:mt-24 md:px-10"
    >
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/25" />
        <p className="font-caslon text-[12px] tracking-[0.28em] whitespace-nowrap text-gray uppercase md:text-[13px]">
          Trusted by operators at
        </p>
        <span className="h-px flex-1 bg-ink/25" />
      </div>

      <div
        className="relative mt-6 overflow-hidden py-2 grayscale"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="tgm-marquee-track flex w-max">
          <LogoRow />
          <LogoRow />
        </div>
      </div>
    </section>
  )
}
