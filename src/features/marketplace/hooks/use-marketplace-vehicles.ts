import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { MarketplaceListParams } from '@/types'

/** Vehicles currently published to the shared marketplace. */
export function useMarketplaceVehicles(params: MarketplaceListParams = {}) {
  return useQuery({
    queryKey: queryKeys.marketplace.list(params),
    queryFn: () => services.marketplace.list(params),
    placeholderData: keepPreviousData,
  })
}
