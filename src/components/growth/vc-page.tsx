import { useState } from 'react'
import { Field, IntakePage, PillGroup } from './lead-intake'

const PORTFOLIO_TYPES = [
  'B2B SaaS',
  'B2C',
  'Marketplace',
  'Deep Tech',
  'AI Infrastructure',
  'Fintech',
  'Healthtech',
  'Developer Tools',
  'Enterprise',
  'Other',
]

export function VcPage() {
  const [portfolioType, setPortfolioType] = useState(PORTFOLIO_TYPES[0])

  return (
    <IntakePage
      audience="vc"
      dark
      heading="Running a VC portfolio with AI companies ready to scale?"
      buildDetails={(form) => ({
        firmName: String(new FormData(form).get('firmName') ?? ''),
        firmWebsite: String(new FormData(form).get('firmWebsite') ?? ''),
        portfolioType,
        companiesNeedingGrowth: String(
          new FormData(form).get('companiesNeedingGrowth') ?? '',
        ),
        source: String(new FormData(form).get('source') ?? ''),
      })}
    >
      <div className="grid w-full gap-6 sm:grid-cols-2">
        <Field label="Firm Name" name="firmName" placeholder="Your firm" dark />
        <Field
          label="Firm Website"
          name="firmWebsite"
          placeholder="https://"
          dark
        />
      </div>

      <PillGroup
        label="Portfolio company type you're investing in"
        options={PORTFOLIO_TYPES}
        value={portfolioType}
        onChange={setPortfolioType}
        accentBg="bg-brand-green"
        accentText="text-brand-gold"
        dark
      />

      <Field
        label="Companies needing growth right now"
        name="companiesNeedingGrowth"
        placeholder="e.g. 3 companies, all B2B SaaS"
        dark
      />

      <Field
        label="Where did you hear about us?"
        name="source"
        placeholder="Referral, LinkedIn, Twitter, podcast..."
        dark
      />
    </IntakePage>
  )
}
