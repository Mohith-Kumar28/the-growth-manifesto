import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addConfession } from '#/server/db'

const PAPER = '/assets/growth/confession-paper.webp'
const PHOTO = '/assets/growth/confession-photo.webp'
const BORDER = '#b6ac91'
const INK = '#504542'
const MAX_CHARS = 280

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
/** Deterministic UTC date string — avoids SSR/client locale mismatch. */
const formatDate = (unixSeconds: number) => {
  const d = new Date(unixSeconds * 1000)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** Postcard face — shared by the teaser, the modal, and the wall. */
export function PostcardFace({
  editable = false,
  message,
  onMessage,
  createdAt,
}: {
  editable?: boolean
  message: string
  onMessage?: (v: string) => void
  createdAt?: number
}) {
  const dateStr =
    createdAt != null
      ? formatDate(createdAt)
      : editable
        ? formatDate(Math.floor(Date.now() / 1000))
        : ''
  return (
    <div
      className="relative aspect-[595/380] w-full overflow-hidden bg-[#e9e0c7] shadow-[0_18px_44px_rgba(0,0,0,0.35)]"
      style={{
        backgroundImage: `url(${PAPER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* left framed photo */}
      <div
        className="absolute top-[6%] left-[3.5%] h-[88%] w-[43%] p-[3px]"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <div
          className="h-full w-full overflow-hidden"
          style={{ border: `0.6px solid ${BORDER}` }}
        >
          <img
            src={PHOTO}
            alt="Vintage landscape"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* right writing area — shifted right so text clears the paper's
          printed divider line; fills full height (no mark block). */}
      <div className="absolute top-[9%] right-[4%] bottom-[8%] flex w-[46%] flex-col pl-4">
        <p
          className="text-center font-fell text-[18px] italic md:text-[22px]"
          style={{ color: BORDER }}
        >
          Honest Confession
        </p>

        {dateStr && (
          <p
            className="mt-0.5 text-center font-caslon text-[10px] tracking-[0.12em] uppercase md:text-[11px]"
            style={{ color: BORDER }}
          >
            {dateStr}
          </p>
        )}

        <label
          className="mt-2 font-fell text-[11px] italic md:text-[12px]"
          style={{ color: BORDER }}
        >
          Write your message here:
        </label>

        {editable ? (
          <div className="relative mt-2 flex-1">
            <textarea
              autoFocus
              maxLength={MAX_CHARS}
              value={message}
              onChange={(e) => onMessage?.(e.target.value)}
              placeholder="Lost 500K in Marketing but didn't cross 100 users…"
              className="h-full w-full resize-none border-none bg-transparent pr-10 font-fell text-[13px] leading-[1.7] italic outline-none placeholder:opacity-45 md:text-[14px]"
              style={{ color: INK, caretColor: INK }}
            />
            <span
              className="absolute right-0 bottom-0 font-fell text-[10px]"
              style={{ color: BORDER }}
            >
              {message.length}/{MAX_CHARS}
            </span>
          </div>
        ) : (
          <p
            className="mt-2 flex-1 overflow-hidden font-fell text-[13px] leading-[1.7] italic md:text-[14px]"
            style={{ color: INK }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export function ConfessionCard() {
  const [open, setOpen] = useState(false)
  const [burning, setBurning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const hpRef = useRef('') // honeypot
  const openedAt = useRef(0)

  const openModal = () => {
    setOpen(true)
    openedAt.current = Date.now()
  }

  const close = () => {
    setOpen(false)
    window.setTimeout(() => {
      setBurning(false)
      setError('')
      setMessage('')
    }, 300)
  }

  // Rising fire embers as the card burns.
  const emberBurst = async () => {
    const confetti = (await import('canvas-confetti')).default
    const fire = ['#ff3d00', '#ff7a18', '#ffcf5c', '#7a2e0e', '#ffd76b']
    const base = { colors: fire, zIndex: 200, ticks: 140, disableForReducedMotion: false }
    confetti({
      ...base,
      particleCount: 70,
      spread: 120,
      startVelocity: 34,
      gravity: 0.7,
      scalar: 0.75,
      origin: { y: 0.58 },
    })
    window.setTimeout(
      () =>
        confetti({
          ...base,
          particleCount: 45,
          angle: 90,
          spread: 70,
          startVelocity: 48,
          gravity: 0.55,
          scalar: 0.6,
          origin: { y: 0.62 },
        }),
      180,
    )
  }

  const submit = async () => {
    if (!message.trim() || saving || burning) return
    setSaving(true)
    setError('')
    try {
      await addConfession({
        data: {
          message,
          hp: hpRef.current,
          elapsed: Date.now() - openedAt.current,
        },
      })
      setBurning(true)
      void emberBurst()
      window.setTimeout(close, 2000) // let it burn away, then dismiss
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Fire distortion filter — animated turbulence makes the burn edge a
          living, ragged flame front rather than a straight wipe. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="tgm-fire" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.03"
            numOctaves={3}
            seed={11}
            result="n"
          >
            <animate
              attributeName="baseFrequency"
              dur="0.7s"
              values="0.014 0.03;0.021 0.046;0.014 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={14}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Resting, tilted teaser at the bottom of the footer card */}
      <motion.button
        type="button"
        onClick={openModal}
        aria-label="Leave an honest confession"
        initial={{ opacity: 0, y: 60, rotate: -4.7 }}
        whileInView={{ opacity: 1, y: 0, rotate: -4.7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: -2, y: -8, transition: { duration: 0.35 } }}
        className="pointer-events-auto absolute bottom-0 left-1/2 hidden w-[560px] max-w-[80vw] origin-bottom -translate-x-1/2 translate-y-[42%] cursor-pointer md:block"
      >
        <PostcardFace message="" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              className="relative z-10 w-full max-w-[560px]"
              initial={{ opacity: 0, scale: 0.85, rotate: -4.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: -3, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-card-cream shadow-lg transition-transform hover:scale-110"
              >
                <img
                  src="/assets/growth/confession-close.svg"
                  alt=""
                  className="h-4 w-4"
                />
              </button>

              <div className={burning ? 'tgm-burning' : undefined}>
                <PostcardFace
                  editable={!burning}
                  message={message}
                  onMessage={setMessage}
                />
              </div>

              {/* honeypot — hidden from humans, tempting to bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                onChange={(e) => (hpRef.current = e.target.value)}
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="mt-4 flex flex-col items-center gap-2">
                {burning ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, times: [0, 0.2, 0.7, 1] }}
                    className="font-fell text-[15px] italic text-brand-gold"
                  >
                    Sealed — your confession burns into the wall.
                  </motion.p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!message.trim() || saving}
                      className="bg-brand-gold px-8 py-3 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? 'Submitting…' : 'Submit Confession'}
                    </button>
                    {error && (
                      <p className="max-w-[420px] text-center font-fell text-[13px] italic text-brand-gold">
                        {error}
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
