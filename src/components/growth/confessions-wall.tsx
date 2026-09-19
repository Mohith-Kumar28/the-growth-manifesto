import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, getRouteApi } from '@tanstack/react-router'
import { Masthead } from './masthead'
import { PostcardFace } from './confession-card'
import { SmoothScroll } from './smooth-scroll'
import { Reveal } from './reveal'
import { toggleConfessionLike } from '#/server/db'
import type { Confession } from '#/server/db'

const route = getRouteApi('/confessions')

/* Deterministic pseudo-random from id — stable across SSR/client. */
const seeded = (id: number, salt: number) => {
  const x = Math.sin(id * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}
// tilt: -4°..+4°
const tiltOf = (id: number) => (seeded(id, 1) * 8 - 4).toFixed(2)

function LikeablePostcard({ confession }: { confession: Confession }) {
  const [likesCount, setLikesCount] = useState(confession.likes_count)
  const [likedByMe, setLikedByMe] = useState(!!confession.liked_by_me)
  const [pending, setPending] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = async () => {
    if (pending) return
    setPending(true)
    const nextLiked = !likedByMe
    setLikedByMe(nextLiked)
    setLikesCount((c) => c + (nextLiked ? 1 : -1))
    try {
      const res = await toggleConfessionLike({ data: { id: confession.id } })
      setLikedByMe(res.liked)
    } catch {
      // revert on failure
      setLikedByMe(!nextLiked)
      setLikesCount((c) => c + (nextLiked ? -1 : 1))
    } finally {
      setPending(false)
    }
  }

  const face = {
    message: confession.message,
    createdAt: confession.created_at,
    likesCount,
    likedByMe,
    onToggleLike: toggle,
  }

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Read full confession"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        style={{ rotate: Number(tiltOf(confession.id)) }}
        whileHover={{ y: -6, transition: { duration: 0.3 } }}
        className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        <PostcardFace clamp {...face} />
      </motion.div>

      {/* Portalled: Reveal's transform would otherwise trap `fixed`. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-5 sm:p-6"
                data-lenis-prevent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Confession"
                  className="relative z-10 my-auto w-full max-w-[720px]"
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    rotate: Number(tiltOf(confession.id)),
                    y: 40,
                  }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute -top-4 right-0 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-card-cream shadow-lg transition-transform hover:scale-110 sm:-top-3 sm:-right-3 sm:translate-y-0"
                  >
                    <img
                      src="/assets/growth/confession-close.svg"
                      alt=""
                      className="h-4 w-4"
                    />
                  </button>
                  <PostcardFace {...face} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}

export function ConfessionsWall() {
  const { items, page, totalPages } = route.useLoaderData()

  return (
    <>
      <SmoothScroll />
      <main className="min-h-screen w-full overflow-x-clip pb-24">
        <Masthead />

        <section className="mx-auto w-full max-w-[1140px] px-6 pt-10 md:px-10 md:pt-16">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <span className="font-caslon text-[12px] tracking-[0.3em] text-gray uppercase md:text-[13px]">
              Unfiltered · Anonymous · True
            </span>
            <h1 className="font-fell text-[34px] italic text-ink-soft md:text-[52px]">
              The Confession Wall
            </h1>
            <p className="max-w-[560px] font-fell text-[16px] leading-snug text-gray-body md:text-[18px]">
              Honest confessions from founders and operators. No names, no
              polish — just what growth actually cost them.
            </p>
            <Link
              to="/"
              className="mt-2 font-caslon text-[14px] text-brand-red transition-opacity hover:opacity-70"
            >
              ← Back to The Manifesto
            </Link>
          </Reveal>

          {items.length === 0 ? (
            <p className="mt-20 text-center font-fell text-[18px] italic text-gray-body">
              No confessions yet. Be the first.
            </p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
              {items.map((c, i) => (
                <Reveal key={c.id} delay={(i % 2) * 0.08}>
                  <LikeablePostcard confession={c} />
                </Reveal>
              ))}
            </div>
          )}

          {/* pagination */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <Link
              to="/confessions"
              search={{ page: page > 2 ? page - 1 : undefined }}
              disabled={page <= 1}
              className="font-caslon text-[15px] text-ink transition-opacity hover:text-brand-red aria-disabled:pointer-events-none aria-disabled:opacity-30"
              aria-disabled={page <= 1}
            >
              ← Prev
            </Link>
            <span className="font-caslon text-[14px] tracking-[0.2em] text-gray uppercase">
              Page {page} of {totalPages}
            </span>
            <Link
              to="/confessions"
              search={{ page: Math.min(totalPages, page + 1) }}
              disabled={page >= totalPages}
              className="font-caslon text-[15px] text-ink transition-opacity hover:text-brand-red aria-disabled:pointer-events-none aria-disabled:opacity-30"
              aria-disabled={page >= totalPages}
            >
              Next →
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
