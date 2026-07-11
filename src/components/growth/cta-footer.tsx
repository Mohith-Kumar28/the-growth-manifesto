const SOCIALS = [
  { icon: '/assets/growth/icon-linkedin.svg', label: 'LinkedIn', href: '#' },
  { icon: '/assets/growth/icon-email.svg', label: 'Email', href: '#' },
  { icon: '/assets/growth/icon-twitter.svg', label: 'Twitter', href: '#' },
]

function Postcard() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 hidden w-[595px] max-w-[80vw] -translate-x-1/2 translate-y-[38%] -rotate-[4.7deg] md:block">
      <div className="relative aspect-[595/380] w-full bg-[#e9e0c7] shadow-2xl">
        <img
          src="/assets/growth/postcard-paper.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* framed photo */}
        <div className="absolute top-[6%] left-[3%] h-[88%] w-[44%] border border-[#b6ac91] p-[3px]">
          <div className="h-full w-full overflow-hidden border-[0.6px] border-[#b6ac91]">
            <img
              src="/assets/growth/postcard-photo.png"
              alt="Vintage landscape photograph"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {/* right side writing area */}
        <div className="absolute top-[8%] right-[4%] w-[48%]">
          <p className="text-center font-fell text-[22px] italic text-[#b6ac91]">
            Honest Confession
          </p>
          <p className="mt-8 font-fell text-[12px] italic text-[#b6ac91]">
            Write your message here:
          </p>
          <div className="mt-2 space-y-3">
            <span className="block h-px bg-[#b6ac91]/50" />
            <span className="block h-px bg-[#b6ac91]/50" />
            <span className="block h-px w-2/3 bg-[#b6ac91]/50" />
          </div>
          <p className="mt-6 font-fell text-[12px] italic text-[#b6ac91]">
            Leave your unique mark:
          </p>
          <p className="font-fell text-[8px] text-[#b6ac91]">
            A doodle, symbol or a mark
          </p>
        </div>
      </div>
    </div>
  )
}

export function CtaFooter() {
  return (
    <section className="mx-auto w-full max-w-[1140px] px-6 pt-20 pb-16 md:px-10 md:pt-28">
      <div className="relative overflow-hidden rounded-sm bg-ink px-6 pt-14 pb-56 md:px-16 md:pt-20 md:pb-64">
        {/* tabs */}
        <div className="flex items-center justify-center gap-5">
          <div className="relative">
            <span className="font-caslon text-[22px] text-brand-gold md:text-[24px]">
              For Founders
            </span>
            <img
              src="/assets/growth/tab-underline.svg"
              alt=""
              aria-hidden
              className="absolute -bottom-2 left-1/2 h-[6px] w-[160px] max-w-[120%] -translate-x-1/2"
            />
          </div>
          <span className="font-caslon text-[22px] text-gray-body md:text-[24px]">
            For VC Firms
          </span>
        </div>

        {/* heading + subline */}
        <div className="mx-auto mt-14 max-w-[743px] text-center">
          <h2 className="font-fell text-[26px] italic text-card-cream md:text-[33.7px]">
            Building an AI company that needs to own the US market?
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] font-fell text-[15px] leading-[1.65] text-card-cream md:text-[16px]">
            We work with a small number of companies at any one time. Selective,
            deliberate, and unapologetic about it.
          </p>
        </div>

        {/* rule */}
        <div className="mx-auto mt-14 max-w-[743px] border-t border-card-cream/60" />

        {/* button */}
        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-brand-gold px-8 py-3.5 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90"
          >
            Submit the case
            <span aria-hidden className="rotate-90">
              ➤
            </span>
          </a>
        </div>

        {/* bottom bar: socials + monogram */}
        <div className="mt-16 flex items-end justify-between">
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                <img src={s.icon} alt={s.label} className="h-8 w-8" />
              </a>
            ))}
          </div>

          <div className="flex w-[150px] flex-col items-center gap-1">
            <img
              src="/assets/growth/ornament-top.svg"
              alt=""
              aria-hidden
              className="h-[44px] w-[150px]"
            />
            <img
              src="/assets/growth/monogram.svg"
              alt="The Growth Manifesto monogram"
              className="h-[35px] w-[133px]"
            />
            <img
              src="/assets/growth/ornament-bottom.svg"
              alt=""
              aria-hidden
              className="h-[22px] w-[112px]"
            />
          </div>
        </div>

        <Postcard />
      </div>
    </section>
  )
}
