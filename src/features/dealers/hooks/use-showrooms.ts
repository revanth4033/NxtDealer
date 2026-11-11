import { useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { EntityId } from '@/types'

/** Showrooms registered under one dealer. Resolves to an empty list when the dealer has none. */
export function useDealerShowrooms(dealerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.showrooms.byDealer(dealerId ?? ''),
    queryFn: () => services.showrooms.listByDealer(dealerId as EntityId),
    enabled: Boolean(dealerId),
  })
}
