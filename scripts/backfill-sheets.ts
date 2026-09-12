/**
 * One-off: copy rows already in D1 into the Google Sheet.
 *
 *   SHEETS_WEBHOOK_URL=... SHEETS_WEBHOOK_SECRET=... pnpm sheets:backfill --remote
 *
 * Defaults to the local D1 database; pass --remote for production. Rows are
 * appended oldest-first. NOT idempotent — running it twice duplicates rows, so
 * clear the tabs first if you rerun it.
 */
import { execFileSync } from 'node:child_process'
import { SHEET_TABS, confessionRow, leadRow } from '../src/server/sheet-rows.ts'
import type { SheetTab } from '../src/server/sheet-rows.ts'

const remote = process.argv.includes('--remote')
const url = process.env.SHEETS_WEBHOOK_URL
const secret = process.env.SHEETS_WEBHOOK_SECRET
if (!url || !secret) {
  console.error('Set SHEETS_WEBHOOK_URL and SHEETS_WEBHOOK_SECRET.')
  process.exit(1)
}

function query<T>(sql: string): Array<T> {
  const out = execFileSync(
    'npx',
    [
      'wrangler',
      'd1',
      'execute',
      'the-growth-manifesto-db',
      remote ? '--remote' : '--local',
      '--json',
      '--command',
      sql,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  )
  // wrangler prints banner lines before the JSON payload.
  return JSON.parse(out.slice(out.indexOf('[')))[0].results
}

async function push(tab: SheetTab, row: Array<string>) {
  const res = await fetch(url!, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret,
      tab: SHEET_TABS[tab].name,
      headers: SHEET_TABS[tab].headers,
      row,
    }),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`${tab}: webhook returned ${res.status}`)
}

const leads = query<{
  created_at: number
  name: string | null
  email: string | null
  audience: string | null
  details: string | null
}>(
  'SELECT created_at, name, email, audience, details FROM leads ORDER BY created_at ASC',
)
const confessions = query<{ created_at: number; message: string }>(
  'SELECT created_at, message FROM confessions ORDER BY created_at ASC',
)
console.log(
  `${leads.length} leads, ${confessions.length} confessions -> ${remote ? 'remote' : 'local'}`,
)

let n = 0
for (const lead of leads) {
  const { tab, row } = leadRow({
    created_at: lead.created_at,
    name: lead.name ?? '',
    email: lead.email ?? '',
    audience: lead.audience ?? 'founders',
    details: lead.details ?? '{}',
  })
  await push(tab, row)
  console.log(`  lead ${++n}/${leads.length} ${tab} ${lead.email}`)
}

n = 0
for (const c of confessions) {
  await push('confessions', confessionRow(c))
  console.log(`  confession ${++n}/${confessions.length}`)
}
console.log('Done.')
