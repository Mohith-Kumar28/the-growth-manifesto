import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Masthead } from './masthead'
import { SmoothScroll } from './smooth-scroll'
import { Reveal } from './reveal'
import { addLead } from '#/server/db'

export function Field({
  label,
  placeholder,
  name,
  dark,
}: {
  label: string
  placeholder: string
  name: string
  dark?: boolean
}) {
  return (
    <label className="block w-full text-left">
      <span
        className={`font-fell text-[18px] italic md:text-[20px] ${dark ? 'text-card-cream' : 'text-ink'}`}
      >
        {label}
      </span>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className={`mt-2 w-full border-b bg-transparent pb-2 font-fell text-[16px] italic outline-none placeholder:opacity-50 md:text-[18px] ${
          dark
            ? 'border-gray-body/70 text-card-cream placeholder:text-gray-body'
            : 'border-rule text-ink placeholder:text-rule'
        }`}
      />
    </label>
  )
}

export function PillGroup({
  label,
  options,
  value,
  onChange,
  accentBg,
  accentText,
  dark,
}: {
  label: string
  options: Array<string>
  value: string
  onChange: (v: string) => void
  accentBg: string
  accentText: string
  dark?: boolean
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <span
        className={`font-fell text-[18px] italic md:text-[20px] ${dark ? 'text-card-cream' : 'text-ink'}`}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isActive = opt === value
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-[10px] border px-[10px] py-[5px] font-fell text-[15px] italic transition-colors md:text-[16px] ${
                isActive
                  ? `border-transparent ${accentBg} text-paper-rect`
                  : `border-transparent ${accentText} opacity-70 hover:opacity-100`
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function IntakePage({
  audience,
  dark = false,
  heading,
  children,
  buildDetails,
}: {
  audience: 'founders' | 'vc'
  dark?: boolean
  heading: string
  children: React.ReactNode
  /** Build the `details` blob from the current form ref before submit. */
  buildDetails: (form: HTMLFormElement) => Record<string, string>
}) {
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const mountedAt = useRef(0)
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    const form = e.currentTarget
    const fd = new FormData(form)
    try {
      await addLead({
        data: {
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          audience,
          details: buildDetails(form),
          hp: String(fd.get('company') ?? ''),
          elapsed: Date.now() - mountedAt.current,
        },
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SmoothScroll />
      <main
        className={`min-h-screen w-full overflow-x-clip pb-24 ${dark ? 'bg-ink' : ''}`}
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

          {sent ? (
            <Reveal delay={0.1}>
              <p
                className={`mt-16 text-center font-fell text-[20px] italic ${
                  dark ? 'text-card-cream' : 'text-ink-soft'
                }`}
              >
                Thank you — we&rsquo;ll be in touch shortly.
              </p>
            </Reveal>
          ) : (
            <Reveal delay={0.1} as="section">
              <form
                onSubmit={submit}
                className="mx-auto mt-14 flex max-w-[845px] flex-col items-end gap-10 md:mt-20"
              >
                {/* honeypot */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div className="grid w-full gap-6 sm:grid-cols-2">
                  <Field
                    label="Name"
                    name="name"
                    placeholder="your full name"
                    dark={dark}
                  />
                  <Field
                    label="Email"
                    name="email"
                    placeholder="work@company.com"
                    dark={dark}
                  />
                </div>

                {children}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-brand-gold px-8 py-3.5 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Submitting…' : 'Submit the case'}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                {error && (
                  <p className="w-full text-center font-fell text-[13px] italic text-brand-red">
                    {error}
                  </p>
                )}
              </form>
            </Reveal>
          )}
        </section>
      </main>
    </>
  )
}
