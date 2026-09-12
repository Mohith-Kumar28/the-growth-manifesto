/**
 * Makes the Worker's `ctx` reachable from server functions so they can hand
 * off background work with `waitUntil`. The request-scoped store is set by
 * `src/server-entry.ts`; callers must tolerate it being undefined (dev
 * transports, or any path that bypasses the entry).
 */
import { AsyncLocalStorage } from 'node:async_hooks'

export type ExecutionContextLike = {
  waitUntil: (promise: Promise<unknown>) => void
}

export const executionContextStore =
  new AsyncLocalStorage<ExecutionContextLike>()

export function getExecutionContext(): ExecutionContextLike | undefined {
  const ctx = executionContextStore.getStore()
  return typeof ctx?.waitUntil === 'function' ? ctx : undefined
}
