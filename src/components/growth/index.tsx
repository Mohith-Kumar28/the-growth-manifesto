import { Masthead } from './masthead'
import { Hero } from './hero'
import { BrandMarquee } from './brand-marquee'
import { ProblemSection } from './problem-section'
import { HowWeWork } from './how-we-work'
import { WorkCards } from './work-cards'
import { CtaFooter } from './cta-footer'
import { SmoothScroll } from './smooth-scroll'

export function GrowthManifesto() {
  return (
    <>
      <SmoothScroll />
      <main id="top" className="min-h-screen w-full overflow-x-clip">
        <Masthead />
        <Hero />
        <BrandMarquee />
        <ProblemSection />
        <HowWeWork />
        <WorkCards />
        <CtaFooter />
      </main>
    </>
  )
}
