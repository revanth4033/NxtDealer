import { useMemo } from 'react'
import { useLocation } from 'react-router'

import type { DealerLinkState } from '@/features/dealers/dealer-link-state'

/**
 * Router state for dealer links on the Marketplace page: the dealer page's back link then returns to
 * this exact view, filters and all, instead of the Dealers directory.
 */
export function useDealerReturnState(): DealerLinkState {
  const { pathname, search } = useLocation()
  return useMemo(() => ({ returnTo: { path: `${pathname}${search}`, label: 'Marketplace' } }), [pathname, search])
}
