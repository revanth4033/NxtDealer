import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { EntityId, ListingListParams } from '@/types'

export function useListings(params: ListingListParams = {}) {
  return useQuery({
    queryKey: queryKeys.listings.list(params),
    queryFn: () => services.listings.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useListing(id: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id ?? ''),
    queryFn: () => services.listings.getById(id as EntityId),
    enabled: Boolean(id),
  })
}
