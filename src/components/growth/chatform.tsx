import { useEffect, useId } from 'react'

const SRC = 'https://chatform.in/embed.js'
const FORM = 'tgm-labs-intake-intro-51939e'

type ChatformApi = { destroy: () => void }

declare global {
  interface Window {
    Chatform?: ChatformApi
    __chatformInstances?: Record<string, ChatformApi | undefined>
  }
}

/** Forget an instance so the next embed.js on this form registers cleanly —
    the script's own destroy() only tears down the DOM. */
function teardown(api: ChatformApi) {
  api.destroy()
  const registry = window.__chatformInstances
  if (registry?.[FORM] === api) delete registry[FORM]
  if (window.Chatform === api) delete window.Chatform
}

/**
 * The Chatform intake form. Its look, launcher and auto-open come from the
 * Chatform dashboard; the only override is `inline`, for the intake pages that
 * embed it in place of the popup.
 *
 * embed.js is a one-shot script, so it's injected on mount and torn down on
 * unmount; that keeps exactly one instance per page across client-side
 * navigation (e.g. popup on `/`, inline on `/founders`).
 */
export function ChatformEmbed({
  inline,
  hidden,
}: {
  inline?: boolean
  /** Saved with each response as `data-hidden-<name>`. */
  hidden?: Record<string, string>
}) {
  const hostId = `chatform-${useId().replace(/:/g, '')}`
  const hiddenKey = JSON.stringify(hidden ?? {})

  useEffect(() => {
    const script = document.createElement('script')
    script.src = SRC
    script.async = true
    script.dataset.form = FORM
    if (inline) {
      script.dataset.mode = 'inline'
      script.dataset.target = `#${hostId}`
    }
    for (const [name, value] of Object.entries(JSON.parse(hiddenKey))) {
      script.setAttribute(`data-hidden-${name}`, String(value))
    }

    let api: ChatformApi | undefined
    let cancelled = false
    // The script registers itself as it runs, so on load the entry is ours.
    script.onload = () => {
      api = window.__chatformInstances?.[FORM]
      if (cancelled && api) teardown(api)
    }
    document.body.appendChild(script)

    return () => {
      // An in-flight script still runs after removal; onload cleans that up.
      cancelled = true
      if (api) teardown(api)
      script.remove()
    }
  }, [inline, hostId, hiddenKey])

  // The inline form focuses its input once it's ready, and the browser scrolls
  // the page to bring that into view. Undo that one jump, as long as the
  // visitor hasn't started scrolling or typing themselves.
  useEffect(() => {
    if (!inline) return
    let lastY = window.scrollY
    const onScroll = () => {
      const focused = document.activeElement
      if (
        focused instanceof HTMLIFrameElement &&
        document.getElementById(hostId)?.contains(focused)
      ) {
        window.scrollTo(0, lastY)
        disarm()
      } else {
        lastY = window.scrollY
      }
    }
    const USER_INPUT = ['wheel', 'touchstart', 'pointerdown', 'keydown']
    function disarm() {
      window.removeEventListener('scroll', onScroll)
      for (const type of USER_INPUT) window.removeEventListener(type, disarm)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    for (const type of USER_INPUT) {
      window.addEventListener(type, disarm, { passive: true, once: true })
    }
    return disarm
  }, [inline, hostId])

  return inline ? <div id={hostId} className="w-full" /> : null
}
