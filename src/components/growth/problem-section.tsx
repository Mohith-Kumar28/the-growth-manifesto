import { SectionBadge } from './section-badge'
import { Reveal } from './reveal'

type ProblemRowProps = {
  quote: string
  body: React.ReactNode
  labelTitle: string
  labelSub: string
  caption: string
  diagram: React.ReactNode
  diagramFirst?: boolean
}

function ProblemText({
  quote,
  body,
  labelTitle,
  labelSub,
}: Pick<ProblemRowProps, 'quote' | 'body' | 'labelTitle' | 'labelSub'>) {
  return (
    <div className="flex flex-col gap-8 md:gap-[62px]">
      <p className="font-fell text-[24px] italic text-brand-blue md:text-[32px]">
        {quote}
      </p>
      <div className="flex flex-col gap-6 md:gap-[37px]">
        <div className="font-fell text-[18px] leading-snug text-gray-body md:text-[20px]">
          {body}
        </div>
        <div>
          <p className="font-fell text-[22px] text-brand-green md:text-[24px]">
            {labelTitle}
          </p>
          <p className="font-fell text-[18px] italic text-gray-body md:text-[20px]">
            {labelSub}
          </p>
        </div>
      </div>
    </div>
  )
}

function ProblemRow({
  quote,
  body,
  labelTitle,
  labelSub,
  caption,
  diagram,
  diagramFirst = false,
}: ProblemRowProps) {
  const text = (
    <ProblemText
      quote={quote}
      body={body}
      labelTitle={labelTitle}
      labelSub={labelSub}
    />
  )
  const art = (
    <Reveal delay={0.1} className="flex items-center justify-center">
      <div className="w-full max-w-[460px]">{diagram}</div>
    </Reveal>
  )

  return (
    <Reveal className="border border-rule/60" y={32}>
      <div className="relative grid grid-cols-1 items-center gap-10 p-6 md:grid-cols-2 md:gap-0">
        <span
          aria-hidden
          className="pointer-events-none absolute top-6 bottom-6 left-1/2 hidden w-px -translate-x-1/2 md:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, var(--color-rule) 0 7px, transparent 7px 15px)',
          }}
        />
        <div className={diagramFirst ? 'md:order-2 md:pl-10' : 'md:pr-10'}>
          {text}
        </div>
        <div className={diagramFirst ? 'md:order-1 md:pr-10' : 'md:pl-10'}>
          {art}
        </div>
      </div>
      <p className="border-t border-rule/60 py-2.5 text-center font-fell text-[18px] text-ink md:text-[20px]">
        {caption}
      </p>
    </Reveal>
  )
}

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="mx-auto w-full max-w-[1076px] px-6 pt-16 md:px-10 md:pt-24"
    >
      <Reveal className="flex flex-col items-center gap-5">
        <SectionBadge className="text-brand-red">
          ◉ Why Startups Don&rsquo;t Grow
        </SectionBadge>
        <h2 className="text-center font-fell text-[28px] italic capitalize md:text-[40px]">
          <span className="text-ink-soft">One channel at a time. </span>
          <span className="text-brand-red">That&rsquo;s the trap.</span>
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col gap-[30px]">
        <ProblemRow
          quote={'“The problem is never the channel.”'}
          body={
            <>
              Channels change.
              <br />
              Algorithms change.
              <br />
              Platforms die.
              <br />
              Most companies build for today&rsquo;s channel. Not
              tomorrow&rsquo;s system.
            </>
          }
          labelTitle="Observation"
          labelSub="Most growth breaks when the channel does"
          caption="Engineered growth, Systems that Scale!"
          diagram={
            <img
              src="/assets/growth/diagram-channels.webp"
              alt="Channel (temporary) feeds into System (Engineered), which feeds into Operator (Decisive)"
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          }
        />

        <ProblemRow
          diagramFirst
          quote={'“We Engineer Growth Systems.”'}
          body={
            <>
              Not hacks. Not campaigns. Systems. Tested. Iterated Compounded.
              Before the window closes
            </>
          }
          labelTitle="Principle"
          labelSub="Test everything. Scale only what proves itself."
          caption="System over hype. Compound over time."
          diagram={
            <img
              src="/assets/growth/diagram-cycle.webp"
              alt="The Growth System cycle: Research (Find Truth), Distribute (Create Reach), Convert (Drive Action), Measure (Feedback)"
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          }
        />

        <ProblemRow
          quote={'“Outcomes That Compound.”'}
          body={
            <>
              We don&rsquo;t chase vanity metrics.
              <br />
              We build systems that deliver real, repeatable business outcomes.
            </>
          }
          labelTitle="Result"
          labelSub="Real systems. Real growth. Real results."
          caption="Build Systems. Not Campaigns."
          diagram={
            <img
              src="/assets/growth/diagram-compound.webp"
              alt="Chart showing compound growth curve overtaking a flat campaign spike over time"
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          }
        />
      </div>
    </section>
  )
}
