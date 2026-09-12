/** 15-minute intro call. Booked off-site, so it opens in its own tab. */
const CAL_URL = 'https://cal.com/tgmlabs/15min'

/**
 * Always-available booking CTA, pinned to the top-right corner of the
 * viewport. Fixed rather than folded into the masthead so that it survives the
 * masthead collapsing on scroll, and so it is present on the intake routes
 * too. Sits above the masthead's z-50.
 *
 * The width is fixed rather than content-sized because the collapsed masthead
 * bar reserves a matching gutter for it (see `masthead.tsx`); letting the label
 * size the button would let the two drift apart at some breakpoints.
 */
export function BookACall() {
  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-2.5 right-2.5 z-[60] w-[112px] rounded-sm bg-brand-red py-2 text-center font-fell text-[10px] tracking-[1.5px] text-paper-rect uppercase shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-opacity hover:opacity-90 md:top-4 md:right-5 md:w-[152px] md:py-2.5 md:text-[12px] md:tracking-[2px]"
    >
      Book a call
    </a>
  )
}
