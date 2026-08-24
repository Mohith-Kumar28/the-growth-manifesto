import { createFileRoute } from '@tanstack/react-router'

import { GrowthManifesto } from '#/components/growth'
import { SITE_NAME, SITE_URL, seo } from '#/lib/seo'

const SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#service`,
  name: SITE_NAME,
  url: SITE_URL,
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  serviceType: 'Growth engineering and distribution for AI and SaaS startups',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'The Distribution Desk',
    itemListElement: [
      'Reddit',
      'Influencer marketing',
      'X + LinkedIn',
      'TikTok Shop',
      'ProductHunt',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: `${name} growth systems` },
    })),
  },
}

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'The Growth Manifesto — Growth Engineering for AI Startups',
      description:
        'We engineer growth systems for AI and SaaS startups that refuse to wait. 5B+ impressions, 10M+ users onboarded — across Reddit, TikTok Shop, influencer and ProductHunt.',
      path: '/',
      imageAlt:
        'The Growth Manifesto — we engineer growth for startups that refuse to wait',
      jsonLd: [SERVICE],
    }),
  component: GrowthManifesto,
})
