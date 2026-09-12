/**
 * Worker entry. Same as `@tanstack/react-start/server-entry`, except it parks
 * the execution context in an AsyncLocalStorage first so server functions can
 * schedule background work with `waitUntil` (see `server/execution-context.ts`).
 * The handler itself only takes the request — env reaches server functions
 * through `cloudflare:workers`.
 */
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { executionContextStore } from './server/execution-context'
import type { ExecutionContextLike } from './server/execution-context'

const handler = createStartHandler(defaultStreamHandler)

export default {
  fetch(
    request: Request,
    _env: unknown,
    ctx: ExecutionContextLike | undefined,
  ) {
    if (typeof ctx?.waitUntil !== 'function') return handler(request)
    return executionContextStore.run(ctx, () => handler(request))
  },
}
