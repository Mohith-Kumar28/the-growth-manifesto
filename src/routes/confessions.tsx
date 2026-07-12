import { createFileRoute } from '@tanstack/react-router'

import { ConfessionsWall } from '#/components/growth/confessions-wall'
import { listConfessions } from '#/server/db'

export const Route = createFileRoute('/confessions')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(1, Number(search.page) || 1),
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listConfessions({ data: { page: deps.page } }),
  component: ConfessionsWall,
})
