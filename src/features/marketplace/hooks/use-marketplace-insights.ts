import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { MarketplaceFilters } from '@/types'

/** Platform-wide marketplace totals and rankings (dealers, cities, makes). */
export function useMarketplaceInsights() {
  return useQuery({
    queryKey: queryKeys.marketplace.insights,
    queryFn: () => services.marketplace.getInsights(),
  })
}

/** Faceted filter option counts for the active filters. Keeps the previous counts while new ones load. */
export function useMarketplaceFacets(filters: MarketplaceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.marketplace.facets(filters),
    queryFn: () => services.marketplace.getFacets(filters),
    placeholderData: keepPreviousData,
  })
}
