/** 15-minute intro call. Booked off-site, so it opens in its own tab. */
const CAL_URL = 'https://cal.com/tgmlabs/intro-call'

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
/** Shared href so the masthead's inline mobile button stays in sync. */
export const CAL_URL_EXPORT = CAL_URL

export function BookACall() {
  return (
    // Hidden on mobile — the masthead renders its own inline button there
    // to avoid overlapping the nameplate / T.G.M. logo.
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-5 z-[60] hidden w-[152px] rounded-sm bg-brand-red py-2.5 text-center font-fell text-[12px] tracking-[2px] text-paper-rect uppercase shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-opacity hover:opacity-90 md:block"
    >
      Book a call
    </a>
  )
}
