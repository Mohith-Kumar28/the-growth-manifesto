import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const PAPER = '/assets/growth/confession-paper.png'
const PHOTO = '/assets/growth/confession-photo.png'
const BORDER = '#b6ac91'
const INK = '#504542'

/** The postcard face — shared between the resting teaser and the open modal. */
function PostcardFace({
  open,
  submitted,
  message,
  onMessage,
}: {
  open: boolean
  submitted: boolean
  message: string
  onMessage?: (v: string) => void
}) {
  return (
    <div
      className="relative aspect-[595/380] w-full overflow-hidden bg-[#e9e0c7] shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
      style={{
        backgroundImage: `url(${PAPER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* left framed photo */}
      <div
        className="absolute top-[6%] left-[3%] h-[88%] w-[44%] p-[3px]"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <div
          className="h-full w-full overflow-hidden"
          style={{ border: `0.6px solid ${BORDER}` }}
        >
          <img
            src={PHOTO}
            alt="Vintage landscape"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* right writing area */}
      <div className="absolute inset-y-[8%] right-[4.5%] flex w-[47%] flex-col">
        <p
          className="text-center font-fell text-[20px] italic md:text-[24px]"
          style={{ color: BORDER }}
        >
          Honest Confession
        </p>

        {/* message block */}
        <label
          className="mt-4 font-fell text-[12px] italic"
          style={{ color: BORDER }}
        >
          Write your message here:
        </label>
        {open && !submitted ? (
          <textarea
            autoFocus
            value={message}
            onChange={(e) => onMessage?.(e.target.value)}
            placeholder="Lost 500K in Marketing but didn't cross 100 users…"
            className="mt-2 h-[104px] w-full resize-none border-none bg-transparent font-fell text-[13px] italic outline-none placeholder:opacity-45"
            style={{
              color: INK,
              caretColor: INK,
              lineHeight: '26px',
              backgroundImage: `repeating-linear-gradient(transparent, transparent 25px, ${BORDER}66 26px)`,
              backgroundAttachment: 'local',
            }}
          />
        ) : (
          <div
            className="mt-2 h-[104px] w-full font-fell text-[13px] italic"
            style={{
              color: INK,
              lineHeight: '26px',
              backgroundImage: `repeating-linear-gradient(transparent, transparent 25px, ${BORDER}66 26px)`,
            }}
          >
            {message}
          </div>
        )}

        {/* mark block */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p
              className="font-fell text-[12px] italic"
              style={{ color: BORDER }}
            >
              Leave your unique mark:
            </p>
            <p
              className="mt-0.5 font-fell text-[9px]"
              style={{ color: BORDER }}
            >
              A doodle, symbol or a mark
            </p>
          </div>
          <div
            className="h-11 w-11 shrink-0 rounded-full"
            style={{ border: `1px dashed ${BORDER}` }}
          />
        </div>
      </div>
    </div>
  )
}

export function ConfessionCard() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  const close = () => {
    setOpen(false)
    // small delay so the exit animation isn't jarring before reset
    window.setTimeout(() => setSubmitted(false), 300)
  }

  return (
    <>
      {/* Resting, tilted teaser that lives at the bottom of the footer card */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Leave an honest confession"
        initial={{ opacity: 0, y: 60, rotate: -4.7 }}
        whileInView={{ opacity: 1, y: 0, rotate: -4.7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: -2, y: -8, transition: { duration: 0.35 } }}
        className="pointer-events-auto absolute bottom-0 left-1/2 hidden w-[560px] max-w-[80vw] origin-bottom -translate-x-1/2 translate-y-[42%] cursor-pointer md:block"
      >
        <PostcardFace open={false} submitted={false} message="" />
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              className="relative w-full max-w-[620px]"
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

              <PostcardFace
                open
                submitted={submitted}
                message={message}
                onMessage={setMessage}
              />

              <div className="mt-4 flex justify-center">
                {submitted ? (
                  <p className="font-fell text-[15px] italic text-card-cream">
                    Thank you — your confession has been received.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => message.trim() && setSubmitted(true)}
                    disabled={!message.trim()}
                    className="bg-brand-gold px-8 py-3 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit Confession
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
