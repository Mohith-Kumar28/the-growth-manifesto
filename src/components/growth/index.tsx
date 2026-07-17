import { Masthead } from './masthead'
import { Hero } from './hero'
import { ProblemSection } from './problem-section'
import { HowWeWork } from './how-we-work'
import { PortfolioAndChannels } from './portfolio-channels'
import { CtaFooter } from './cta-footer'
import { SmoothScroll } from './smooth-scroll'

export function GrowthManifesto() {
  return (
    <>
      <SmoothScroll />
      <main id="top" className="min-h-screen w-full overflow-x-clip">
        <Masthead />
        <Hero />
        <ProblemSection />
        <HowWeWork />
        <PortfolioAndChannels />
        <CtaFooter />
      </main>
    </>
  )
}
