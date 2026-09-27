import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Masthead } from './masthead'
import { SmoothScroll } from './smooth-scroll'
import { Reveal } from './reveal'
import { ChatformEmbed } from './chatform'
import { useFormSnap } from './use-form-snap'

export function IntakePage({
  audience,
  dark = false,
  heading,
}: {
  audience: 'founders' | 'vc'
  dark?: boolean
  heading: string
}) {
  const slotRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { engaged, sheet, engage, close } = useFormSnap(slotRef, panelRef)

  return (
    <>
      <SmoothScroll />
      <main
        className={`min-h-screen w-full overflow-x-clip pb-40 md:pb-32 ${dark ? 'bg-ink' : ''}`}
      >
        <Masthead dark={dark} />

        <section className="mx-auto w-full max-w-[1076px] px-6 pt-16 md:px-10 md:pt-20">
          <Reveal className="flex flex-col items-center gap-4">
            <h1
              className={`text-center font-fell text-[28px] italic md:text-[40px] ${
                dark ? 'text-card-cream' : 'text-ink-soft'
              }`}
            >
              {heading}
            </h1>
            <Link
              to="/"
              className={`font-caslon text-[14px] transition-opacity hover:opacity-70 ${
                dark ? 'text-brand-gold' : 'text-brand-red'
              }`}
            >
              ← Back to The Manifesto
            </Link>
          </Reveal>

          {/* Chatform intake, inline. `audience` is saved with each response
              so founder and VC leads can be told apart. On phones the frame
              grows into a full-screen sheet (see useFormSnap). Its radius is
              the embed's own 16px plus the 1px border. */}
          <div ref={slotRef} className="mx-auto mt-14 max-w-[845px] md:mt-20">
            <div
              ref={panelRef}
              role={sheet ? 'dialog' : undefined}
              aria-modal={sheet || undefined}
              aria-label={sheet ? 'Intake form' : undefined}
              className={
                sheet
                  ? 'fixed inset-0 z-[70] h-[100dvh] bg-[#fdfaf3] [&_.cf-inline]:!h-full [&_.cf-inline]:!rounded-none [&>div]:h-full'
                  : `relative overflow-hidden rounded-[17px] border ${
                      dark ? 'border-brand-gold/70' : 'border-rule'
                    }`
              }
            >
              <ChatformEmbed inline hidden={{ audience }} />
              {/* The iframe swallows wheel and touch, which would strand a
                  visitor whose cursor or finger lands on it. Until the form is
                  engaged this shield takes those instead, so the page scrolls
                  (and snaps or opens the sheet); a click or tap engages it. */}
              {!engaged && (
                <div
                  aria-hidden
                  data-form-shield
                  onClick={engage}
                  className="absolute inset-0 cursor-pointer"
                />
              )}
              {sheet && (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close the form"
                  className="absolute top-[max(12px,env(safe-area-inset-top))] right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/85 text-paper-rect shadow-md"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
