import { useState } from 'react'
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
// natural trim: 80..170 chars, cut on a word boundary
const trimNatural = (text: string, id: number) => {
  const max = 80 + Math.floor(seeded(id, 2) * 90)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`
}

function LikeablePostcard({ confession }: { confession: Confession }) {
  const [likesCount, setLikesCount] = useState(confession.likes_count)
  const [likedByMe, setLikedByMe] = useState(!!confession.liked_by_me)
  const [pending, setPending] = useState(false)

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

  return (
    <div style={{ transform: `rotate(${tiltOf(confession.id)}deg)` }}>
      <PostcardFace
        message={trimNatural(confession.message, confession.id)}
        createdAt={confession.created_at}
        likesCount={likesCount}
        likedByMe={likedByMe}
        onToggleLike={toggle}
      />
    </div>
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
              search={{ page: Math.max(1, page - 1) }}
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
