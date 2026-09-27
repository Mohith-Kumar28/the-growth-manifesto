import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { RefObject } from 'react'
import type Lenis from 'lenis'

/** Clears the collapsed masthead bar; matches `scrollToId`. */
const OFFSET = 90
/** How far down from the top commits to the form. */
const ENTER = 24
/** How far away from the form a scroll must travel before it lets go. */
const LEAVE = 160
/** Quiet time after the last wheel / scroll event before deciding. */
const WHEEL_SETTLE_MS = 90
const SCROLL_SETTLE_MS = 140
/** Below this the form opens as a full-screen sheet instead of snapping. */
const SHEET_QUERY = '(max-width: 767px)'
/** Matches the frame's rounded-[17px]. */
const RADIUS = 17
const SHEET_MS = 420
const SHEET_EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

const getLenis = () => (window as unknown as { lenis?: Lenis }).lenis

/** clip-path that crops the full viewport down to `r`. */
const clipTo = (r: DOMRect) =>
  `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round ${RADIUS}px)`
const CLIP_FULL = 'inset(0px 0px 0px 0px round 0px)'

/**
 * Scroll behaviour for the inline intake form.
 *
 * Desktop: a two-stop snap between the top of the page and the form framed
 * under the masthead. A small scroll from the top glides the form into view;
 * once there it holds, springing back from small scrolls, and only lets go
 * after a deliberate push of more than `LEAVE`.
 *
 * Phone: the same small scroll instead grows the form, in place, into a
 * full-screen sheet (the iframe is never moved, so the conversation survives);
 * `close` shrinks it back.
 *
 * Decides from Lenis's target (where the scroll is headed) rather than waiting
 * for the momentum to die out, so it reacts right away. Under reduced motion
 * (no Lenis) it jumps instead of gliding.
 *
 * `slot` is the in-flow box that keeps the form's place; `panel` is the
 * bordered frame inside it that becomes the sheet. `engaged` says whether the
 * form is the resting stop (snapped or open), i.e. whether its iframe should
 * take input yet.
 */
export function useFormSnap(
  slot: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
) {
  const [engaged, setEngaged] = useState(false)
  const [sheet, setSheet] = useState(false)
  const actions = useRef({ engage: () => {}, close: () => {} })
  /** Where the form sat when the sheet opened, for the grow animation. */
  const fromRect = useRef<DOMRect | null>(null)
  /** The shrink animation, held on its last frame until the sheet unmounts. */
  const closing = useRef<Animation | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const phone = window.matchMedia(SHEET_QUERY)
    let atForm = false
    let sheetOpen = false
    let userActive = false
    let snapping = false
    let timer = 0
    /** The embed's own inline height, which its auto-resize bumps to the
        sheet's height while open; put back on close. */
    let inlineHeight = ''
    const embedBox = () =>
      panel.current?.querySelector<HTMLElement>('.cf-inline') ?? null

    const setAtForm = (value: boolean) => {
      atForm = value
      setEngaged(value)
    }

    const formY = () => {
      const el = slot.current
      if (!el) return 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
      return Math.max(0, Math.min(max, top))
    }

    const snapTo = (y: number, toForm: boolean) => {
      setAtForm(toForm)
      userActive = false
      if (Math.abs(window.scrollY - y) < 2) return
      snapping = true
      const done = () => {
        snapping = false
      }
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(y, {
          duration: 0.6,
          easing: easeOutQuart,
          lock: true,
          force: true,
          onComplete: done,
        })
      } else {
        window.scrollTo({ top: y, behavior: reduced ? 'instant' : 'smooth' })
        window.setTimeout(done, reduced ? 0 : 600)
      }
    }

    const lockPage = (locked: boolean) => {
      document.documentElement.style.overflow = locked ? 'hidden' : ''
      const lenis = getLenis()
      if (locked) lenis?.stop()
      else lenis?.start()
    }

    const openSheet = () => {
      if (sheetOpen || !panel.current) return
      sheetOpen = true
      userActive = false
      fromRect.current = panel.current.getBoundingClientRect()
      // Hold the form's place in the page while it's lifted out of flow.
      if (slot.current)
        slot.current.style.height = `${fromRect.current.height}px`
      inlineHeight = embedBox()?.style.height ?? ''
      lockPage(true)
      setAtForm(true)
      setSheet(true)
    }

    const closeSheet = () => {
      const el = panel.current
      const place = slot.current
      if (!sheetOpen || !el || !place) return
      const finish = () => {
        sheetOpen = false
        setSheet(false)
        place.style.height = ''
        const box = embedBox()
        if (box && inlineHeight) box.style.height = inlineHeight
        lockPage(false)
        // A still-focused iframe would drag the page back down to itself.
        if (el.contains(document.activeElement)) {
          ;(document.activeElement as HTMLElement).blur()
        }
        // Back to the top, so the next scroll down opens it again.
        snapTo(0, false)
      }
      if (reduced) return finish()
      closing.current = el.animate(
        [
          { clipPath: CLIP_FULL },
          { clipPath: clipTo(place.getBoundingClientRect()) },
        ],
        { duration: SHEET_MS, easing: SHEET_EASE, fill: 'forwards' },
      )
      closing.current.onfinish = finish
    }

    const decide = () => {
      if (!userActive || snapping || sheetOpen) return
      const y = getLenis()?.targetScroll ?? window.scrollY
      const target = formY()
      if (phone.matches) {
        if (y > ENTER) openSheet()
        return
      }
      if (atForm) {
        if (y < target - LEAVE) snapTo(0, false)
        else if (y <= target + LEAVE) snapTo(target, true)
        else setAtForm(false)
      } else if (y <= ENTER) {
        snapTo(0, false)
      } else if (y < target + LEAVE) {
        snapTo(target, true)
      }
    }

    actions.current = {
      engage: () => (phone.matches ? openSheet() : snapTo(formY(), true)),
      close: closeSheet,
    }

    const schedule = (ms: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(decide, ms)
    }
    const onWheel = () => {
      userActive = true
      schedule(WHEEL_SETTLE_MS)
    }
    const onInput = () => {
      userActive = true
    }
    const onScroll = () => {
      if (userActive && !snapping) schedule(SCROLL_SETTLE_MS)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet()
      else onInput()
    }
    // Rotating or resizing past the breakpoint with the sheet open.
    const onBreakpoint = () => {
      if (!phone.matches) closeSheet()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onInput, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    phone.addEventListener('change', onBreakpoint)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onInput)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      phone.removeEventListener('change', onBreakpoint)
      if (sheetOpen) lockPage(false)
    }
  }, [slot, panel])

  // Grow from where the form sat, now that it's fixed to the viewport.
  useLayoutEffect(() => {
    if (!sheet) {
      closing.current?.cancel()
      closing.current = null
      return
    }
    const el = panel.current
    const from = fromRect.current
    if (!el || !from) return
    fromRect.current = null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate([{ clipPath: clipTo(from) }, { clipPath: CLIP_FULL }], {
      duration: SHEET_MS,
      easing: SHEET_EASE,
    })
  }, [sheet, panel])

  const engage = useCallback(() => actions.current.engage(), [])
  const close = useCallback(() => actions.current.close(), [])
  return { engaged, sheet, engage, close }
}
