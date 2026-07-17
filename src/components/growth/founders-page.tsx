import { useState } from 'react'
import { Field, IntakePage, PillGroup } from './lead-intake'

const STAGES = ['Bootstraped', 'Seed', 'Series A', 'Series B', 'Series C']
const MRR_BANDS = ['0-50K', '50k-100k', 'More than 100k']

export function FoundersPage() {
  const [stage, setStage] = useState(STAGES[0])
  const [mrr, setMrr] = useState(MRR_BANDS[0])

  return (
    <IntakePage
      audience="founders"
      heading="Building an AI company that needs to own the US market?"
      buildDetails={(form) => ({
        companyName: String(new FormData(form).get('companyName') ?? ''),
        companyWebsite: String(new FormData(form).get('companyWebsite') ?? ''),
        stage,
        building: String(new FormData(form).get('building') ?? ''),
        mrr,
        source: String(new FormData(form).get('source') ?? ''),
      })}
    >
      <div className="grid w-full gap-6 sm:grid-cols-2">
        <Field label="Company Name" name="companyName" placeholder="Your startup" />
        <Field
          label="Company Website"
          name="companyWebsite"
          placeholder="https://"
        />
      </div>

      <PillGroup
        label="Current Stage"
        options={STAGES}
        value={stage}
        onChange={setStage}
        accentBg="bg-ink"
        accentText="text-brand-gold"
      />

      <Field
        label="What are you building?"
        name="building"
        placeholder="Describe your product, who it's for, and what problem it solves"
      />

      <PillGroup
        label="Current MRR"
        options={MRR_BANDS}
        value={mrr}
        onChange={setMrr}
        accentBg="bg-ink"
        accentText="text-brand-gold"
      />

      <Field
        label="Where did you hear about us?"
        name="source"
        placeholder="Referral, LinkedIn, Twitter, podcast..."
      />
    </IntakePage>
  )
}
