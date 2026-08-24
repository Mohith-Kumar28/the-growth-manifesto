import { createFileRoute } from '@tanstack/react-router'

import { FoundersPage } from '#/components/growth/founders-page'
import { breadcrumb, seo } from '#/lib/seo'

export const Route = createFileRoute('/founders')({
  head: () =>
    seo({
      title: 'For Founders — The Growth Manifesto',
      description:
        "Building an AI company that needs to own the US market? Tell us your stage, MRR and what you're building, and we'll show you the growth system that fits.",
      path: '/founders',
      image: '/assets/og/og-founders.jpg',
      imageAlt: 'For Founders — The Growth Manifesto',
      jsonLd: [breadcrumb('For Founders', '/founders')],
    }),
  component: FoundersPage,
})
