/**
 * Mirrors form submissions into a Google Sheet via an Apps Script web app.
 *
 * D1 stays the source of truth — the sheet is a convenience copy. Every
 * failure here is swallowed so a broken or slow webhook can never lose a lead
 * or show the visitor an error.
 */
import { SHEET_TABS } from './sheet-rows'
import { getExecutionContext } from './execution-context'
import type { SheetTab } from './sheet-rows'

export type SheetsEnv = {
  SHEETS_WEBHOOK_URL?: string
  SHEETS_WEBHOOK_SECRET?: string
}

const WEBHOOK_TIMEOUT_MS = 8000

/** POSTs one row. Resolves false on any failure; never throws. */
export async function postRow(
  env: SheetsEnv,
  tab: SheetTab,
  row: Array<string>,
): Promise<boolean> {
  const url = env.SHEETS_WEBHOOK_URL
  const secret = env.SHEETS_WEBHOOK_SECRET
  if (!url || !secret) return false // not configured — silently skip
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret,
        tab: SHEET_TABS[tab].name,
        headers: SHEET_TABS[tab].headers,
        row,
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      redirect: 'follow',
    })
    if (!res.ok) {
      console.error(`sheets: ${tab} webhook returned ${res.status}`)
      return false
    }
    return true
  } catch (err) {
    console.error(`sheets: ${tab} webhook failed`, err)
    return false
  }
}

/**
 * Sends the row after the response goes out, so the visitor never waits on
 * Apps Script (which can take a second or two). Falls back to awaiting when no
 * execution context is available.
 */
export async function mirrorRow(
  env: SheetsEnv,
  tab: SheetTab,
  row: Array<string>,
): Promise<void> {
  const ctx = getExecutionContext()
  if (ctx) {
    ctx.waitUntil(postRow(env, tab, row))
    return
  }
  await postRow(env, tab, row)
}
