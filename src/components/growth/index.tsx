import { Masthead } from './masthead'
import { Hero } from './hero'
import { ProblemSection } from './problem-section'
import { HowWeWork } from './how-we-work'
import { WorkCards } from './work-cards'
import { CtaFooter } from './cta-footer'

export function GrowthManifesto() {
  return (
    <main className="min-h-screen w-full overflow-x-clip">
      <Masthead />
      <Hero />
      <ProblemSection />
      <HowWeWork />
      <WorkCards />
      <CtaFooter />
    </main>
  )
}
