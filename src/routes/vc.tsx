import { createFileRoute } from '@tanstack/react-router'

import { VcPage } from '#/components/growth/vc-page'

export const Route = createFileRoute('/vc')({ component: VcPage })
