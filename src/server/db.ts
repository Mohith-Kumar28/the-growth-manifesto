import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { env } from 'cloudflare:workers'

/* Minimal D1 shape — avoids depending on @cloudflare/workers-types. */
type Stmt = {
  bind: (...args: Array<unknown>) => Stmt
  all: <T = unknown>() => Promise<{ results: Array<T> }>
  first: <T = unknown>() => Promise<T | null>
  run: () => Promise<unknown>
}
type D1 = { prepare: (query: string) => Stmt }

const db = () => (env as unknown as { DB: D1 }).DB
const now = () => Math.floor(Date.now() / 1000)

const PER_PAGE = 6
// Anti-brute-force windows.
const MIN_GAP_SECONDS = 20 // at most one submission per 20s
const HOURLY_CAP = 5 // at most 5 per hour
const LIFETIME_CAP = 30 // at most 30 confessions per user, ever
const MIN_ELAPSED_MS = 1200 // faster than this = almost certainly a bot
// Quality floor for the wall. Heuristics, not moderation — just enough to
// keep "abc" and keyboard mash off a page people are meant to read.
const MIN_MESSAGE_CHARS = 25
const MIN_MESSAGE_WORDS = 5

/** Best-effort anonymous identity: hash of IP + UA + language. */
async function fingerprint(): Promise<string> {
  const ip =
    getRequestHeader('cf-connecting-ip') ||
    getRequestHeader('x-forwarded-for') ||
    getRequestHeader('x-real-ip') ||
    'unknown'
  const ua = getRequestHeader('user-agent') || ''
  const lang = getRequestHeader('accept-language') || ''
  const bytes = new TextEncoder().encode(`${ip}|${ua}|${lang}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

/** Throws if this fingerprint is submitting too fast / too often. */
async function enforceRate(table: 'confessions' | 'leads', fp: string) {
  const t = now()
  const row = await db()
    .prepare(
      `SELECT
         SUM(CASE WHEN created_at > ? THEN 1 ELSE 0 END) AS recent,
         SUM(CASE WHEN created_at > ? THEN 1 ELSE 0 END) AS hourly
       FROM ${table} WHERE fingerprint = ?`,
    )
    .bind(t - MIN_GAP_SECONDS, t - 3600, fp)
    .first<{ recent: number; hourly: number }>()
  if (Number(row?.recent ?? 0) > 0) {
    throw new Error('Slow down — one submission at a time, please.')
  }
  if (Number(row?.hourly ?? 0) >= HOURLY_CAP) {
    throw new Error('You have reached the hourly limit. Try again later.')
  }
}

/** Cheap bot check: honeypot must be empty, form must not be filled instantly. */
function looksLikeBot(hp: string, elapsed: number): boolean {
  return hp.length > 0 || elapsed < MIN_ELAPSED_MS
}

/** Returns a reader-facing reason the message can't go on the wall, or null. */
function rejectReason(message: string): string | null {
  if (message.length < MIN_MESSAGE_CHARS) {
    return `A confession needs at least ${MIN_MESSAGE_CHARS} characters.`
  }
  const words = message.split(/\s+/).filter((w) => /\p{L}/u.test(w))
  if (words.length < MIN_MESSAGE_WORDS) {
    return `A confession needs at least ${MIN_MESSAGE_WORDS} words.`
  }
  const noise =
    'That does not read like a sentence. Write it in your own words.'
  // Mostly digits/punctuation, or one character hammered — keyboard mash.
  const letters = message.match(/\p{L}/gu)?.length ?? 0
  if (letters < message.length * 0.5) return noise
  if (/(.)\1{4,}/u.test(message)) return noise
  // "test test test test test" and friends.
  const unique = new Set(words.map((w) => w.toLowerCase()))
  if (unique.size * 2 < words.length) return noise
  // Latin words with no vowel are mash ("qwrt zxcv"). Other scripts are exempt.
  const latin = words.filter((w) => /^[a-z]{3,}$/i.test(w))
  const voweless = latin.filter((w) => !/[aeiouy]/i.test(w)).length
  if (latin.length >= MIN_MESSAGE_WORDS && voweless * 2 > latin.length)
    return noise
  return null
}

export type Confession = {
  id: number
  message: string
  created_at: number
  likes_count: number
  liked_by_me: 0 | 1
}

export const listConfessions = createServerFn({ method: 'GET' })
  .validator((d: { page?: number } | undefined) => ({
    page: Math.max(1, Number(d?.page) || 1),
  }))
  .handler(async ({ data }) => {
    const offset = (data.page - 1) * PER_PAGE
    const fp = await fingerprint()
    const { results } = await db()
      .prepare(
        `SELECT c.id, c.message, c.created_at, c.likes_count,
                EXISTS(
                  SELECT 1 FROM confession_likes cl
                  WHERE cl.confession_id = c.id AND cl.fingerprint = ?
                ) AS liked_by_me
         FROM confessions c
         ORDER BY c.id DESC LIMIT ? OFFSET ?`,
      )
      .bind(fp, PER_PAGE, offset)
      .all<Confession>()
    const total = Number(
      (
        await db()
          .prepare('SELECT COUNT(*) AS c FROM confessions')
          .first<{ c: number }>()
      )?.c ?? 0,
    )
    return {
      items: results,
      page: data.page,
      perPage: PER_PAGE,
      total,
      totalPages: Math.max(1, Math.ceil(total / PER_PAGE)),
    }
  })

export const toggleConfessionLike = createServerFn({ method: 'POST' })
  .validator((d: { id?: number } | undefined) => ({
    id: Number(d?.id) || 0,
  }))
  .handler(async ({ data }) => {
    if (!data.id) throw new Error('Missing confession id')
    const fp = await fingerprint()
    const existing = await db()
      .prepare(
        'SELECT 1 FROM confession_likes WHERE confession_id = ? AND fingerprint = ?',
      )
      .bind(data.id, fp)
      .first()
    if (existing) {
      await db()
        .prepare(
          'DELETE FROM confession_likes WHERE confession_id = ? AND fingerprint = ?',
        )
        .bind(data.id, fp)
        .run()
      await db()
        .prepare(
          'UPDATE confessions SET likes_count = MAX(0, likes_count - 1) WHERE id = ?',
        )
        .bind(data.id)
        .run()
      return { liked: false }
    }
    await db()
      .prepare(
        'INSERT INTO confession_likes (confession_id, fingerprint, created_at) VALUES (?, ?, ?)',
      )
      .bind(data.id, fp, now())
      .run()
    await db()
      .prepare(
        'UPDATE confessions SET likes_count = likes_count + 1 WHERE id = ?',
      )
      .bind(data.id)
      .run()
    return { liked: true }
  })

export const addConfession = createServerFn({ method: 'POST' })
  .validator(
    (d: { message?: string; hp?: string; elapsed?: number } | undefined) => ({
      message: (d?.message ?? '').trim().slice(0, 500),
      hp: (d?.hp ?? '').trim(),
      elapsed: Number(d?.elapsed) || 0,
    }),
  )
  .handler(async ({ data }) => {
    if (!data.message) throw new Error('Message required')
    // Silently swallow obvious bots — no signal back to the attacker.
    if (looksLikeBot(data.hp, data.elapsed)) return { ok: true }
    const rejected = rejectReason(data.message)
    if (rejected) throw new Error(rejected)
    const fp = await fingerprint()
    await enforceRate('confessions', fp)
    const lifetime = Number(
      (
        await db()
          .prepare(
            'SELECT COUNT(*) AS c FROM confessions WHERE fingerprint = ?',
          )
          .bind(fp)
          .first<{ c: number }>()
      )?.c ?? 0,
    )
    if (lifetime >= LIFETIME_CAP) {
      throw new Error(`You have reached the ${LIFETIME_CAP}-confession limit.`)
    }
    await db()
      .prepare(
        'INSERT INTO confessions (message, fingerprint, created_at) VALUES (?, ?, ?)',
      )
      .bind(data.message, fp, now())
      .run()
    return { ok: true }
  })

export const addLead = createServerFn({ method: 'POST' })
  .validator(
    (
      d:
        | {
            name?: string
            email?: string
            message?: string
            audience?: string
            details?: Record<string, string>
            hp?: string
            elapsed?: number
          }
        | undefined,
    ) => ({
      name: (d?.name ?? '').trim().slice(0, 120),
      email: (d?.email ?? '').trim().slice(0, 200),
      message: (d?.message ?? '').trim().slice(0, 500),
      audience: d?.audience === 'vc' ? 'vc' : 'founders',
      details: JSON.stringify(d?.details ?? {}).slice(0, 4000),
      hp: (d?.hp ?? '').trim(),
      elapsed: Number(d?.elapsed) || 0,
    }),
  )
  .handler(async ({ data }) => {
    if (!data.email) throw new Error('Email required')
    if (looksLikeBot(data.hp, data.elapsed)) return { ok: true }
    const fp = await fingerprint()
    await enforceRate('leads', fp)
    await db()
      .prepare(
        'INSERT INTO leads (name, email, message, audience, details, fingerprint, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(
        data.name,
        data.email,
        data.message,
        data.audience,
        data.details,
        fp,
        now(),
      )
      .run()
    return { ok: true }
  })
