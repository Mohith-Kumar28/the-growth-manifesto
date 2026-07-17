import { createFileRoute } from '@tanstack/react-router'

import { FoundersPage } from '#/components/growth/founders-page'

export const Route = createFileRoute('/founders')({ component: FoundersPage })
