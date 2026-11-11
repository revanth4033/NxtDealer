import { useMatches } from 'react-router'

import type { RouteHandle } from '@/app/route-handle'

export interface Breadcrumb {
  label: string
  /** Absolute path. The last crumb is the current page. */
  path: string
}

/** Builds breadcrumbs from every matched route that declares a `handle`. Nested routes add crumbs automatically. */
export function useBreadcrumbs(): Breadcrumb[] {
  return useMatches()
    .filter((match) => (match.handle as RouteHandle | undefined)?.title)
    .map((match) => {
      const handle = match.handle as RouteHandle
      return { label: handle.breadcrumb ?? handle.title, path: match.pathname }
    })
}
