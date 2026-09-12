/**
 * Tab layout and D1-row -> sheet-row mapping. Pure and dependency-free so the
 * Worker (src/server/sheets.ts) and the backfill script share one definition.
 *
 * Column order here is the contract with the spreadsheet: append new columns
 * at the end, never insert in the middle, or old rows stop lining up.
 */

export const SHEET_TABS = {
  founders: {
    name: 'Founders',
    headers: [
      'Date',
      'Name',
      'Email',
      'Company Name',
      'Company Website',
      'Stage',
      'What They Are Building',
      'MRR',
      'Source',
    ],
  },
  vc: {
    name: 'VC',
    headers: [
      'Date',
      'Name',
      'Email',
      'Firm Name',
      'Firm Website',
      'Portfolio Type',
      'Companies Needing Growth',
      'Source',
    ],
  },
  confessions: {
    name: 'Confessions',
    headers: ['Date', 'Confession'],
  },
} as const

export type SheetTab = keyof typeof SHEET_TABS

/** `YYYY-MM-DD HH:MM` in IST, without depending on Intl/ICU in the runtime. */
export function istTimestamp(unixSeconds: number): string {
  const ist = new Date((unixSeconds + 5.5 * 3600) * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${ist.getUTCFullYear()}-${p(ist.getUTCMonth() + 1)}-${p(ist.getUTCDate())}` +
    ` ${p(ist.getUTCHours())}:${p(ist.getUTCMinutes())}`
  )
}

/** Maps a `leads` row to its tab and cells, unpacking the `details` JSON. */
export function leadRow(lead: {
  created_at: number
  name: string
  email: string
  audience: string
  details: string
}): { tab: SheetTab; row: Array<string> } {
  let details: Record<string, string | undefined> = {}
  try {
    details = JSON.parse(lead.details || '{}')
  } catch {
    details = {}
  }
  const when = istTimestamp(lead.created_at)
  if (lead.audience === 'vc') {
    return {
      tab: 'vc',
      row: [
        when,
        lead.name,
        lead.email,
        details.firmName ?? '',
        details.firmWebsite ?? '',
        details.portfolioType ?? '',
        details.companiesNeedingGrowth ?? '',
        details.source ?? '',
      ],
    }
  }
  return {
    tab: 'founders',
    row: [
      when,
      lead.name,
      lead.email,
      details.companyName ?? '',
      details.companyWebsite ?? '',
      details.stage ?? '',
      details.building ?? '',
      details.mrr ?? '',
      details.source ?? '',
    ],
  }
}

export function confessionRow(c: {
  created_at: number
  message: string
}): Array<string> {
  return [istTimestamp(c.created_at), c.message]
}
