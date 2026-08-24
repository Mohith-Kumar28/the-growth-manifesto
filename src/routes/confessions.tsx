import { createFileRoute } from '@tanstack/react-router'

import { ConfessionsWall } from '#/components/growth/confessions-wall'
import { SITE_URL, breadcrumb, seo } from '#/lib/seo'
import { listConfessions } from '#/server/db'

const PATH = '/confessions'
const pageUrl = (page: number) =>
  page > 1 ? `${SITE_URL}${PATH}?page=${page}` : `${SITE_URL}${PATH}`

export const Route = createFileRoute('/confessions')({
  // `page` stays out of the URL on page 1 so /confessions is a real, directly
  // reachable page rather than a 307 to /confessions?page=1 — crawlers index
  // the clean URL and rel=canonical points at itself.
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.max(1, Number(search.page) || 1)
    return page > 1 ? { page } : {}
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: ({ deps }) => listConfessions({ data: { page: deps.page } }),
  head: ({ loaderData }) => {
    const page = loaderData?.page ?? 1
    const totalPages = loaderData?.totalPages ?? 1
    const suffix = page > 1 ? ` (Page ${page})` : ''
    const base = seo({
      title: `The Confession Wall${suffix} — The Growth Manifesto`,
      description:
        'Unfiltered, anonymous confessions from founders and operators about what growth actually cost them. No names, no polish — just the real numbers.',
      path: page > 1 ? `${PATH}?page=${page}` : PATH,
      image: '/assets/og/og-confessions.jpg',
      imageAlt: 'The Confession Wall — unfiltered, anonymous, true',
      jsonLd: [breadcrumb('The Confession Wall', PATH)],
    })
    return {
      ...base,
      links: [
        ...base.links,
        ...(page > 1 ? [{ rel: 'prev', href: pageUrl(page - 1) }] : []),
        ...(page < totalPages
          ? [{ rel: 'next', href: pageUrl(page + 1) }]
          : []),
      ],
    }
  },
  component: ConfessionsWall,
})
