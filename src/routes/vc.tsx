import { createFileRoute } from '@tanstack/react-router'

import { VcPage } from '#/components/growth/vc-page'
import { breadcrumb, seo } from '#/lib/seo'

export const Route = createFileRoute('/vc')({
  head: () =>
    seo({
      title: 'For VC Firms — The Growth Manifesto',
      description:
        'Running a VC portfolio with AI companies ready to scale? We plug tested growth systems into the portfolio companies that are ready for distribution.',
      path: '/vc',
      image: '/assets/og/og-vc.jpg',
      imageAlt: 'For VC Firms — The Growth Manifesto',
      jsonLd: [breadcrumb('For VC Firms', '/vc')],
    }),
  component: VcPage,
})
