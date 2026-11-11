import { useMatches } from 'react-router'

import type { RouteHandle } from '@/app/route-handle'

/** Returns the `handle` of the deepest matched route that declares one. */
export function useRouteMeta(): RouteHandle | undefined {
  const matches = useMatches()
  for (let i = matches.length - 1; i >= 0; i--) {
    const handle = matches[i].handle as RouteHandle | undefined
    if (handle?.title) return handle
  }
  return undefined
}
