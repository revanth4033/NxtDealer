import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { DealerListParams, EntityId } from '@/types'

export function useDealers(params: DealerListParams = {}) {
  return useQuery({
    queryKey: queryKeys.dealers.list(params),
    queryFn: () => services.dealers.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useDealer(id: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.dealers.detail(id ?? ''),
    queryFn: () => services.dealers.getById(id as EntityId),
    enabled: Boolean(id),
  })
}

/**
 * Platform-wide dealer counts by account status. Reads the platform dashboard summary,
 * so the Dashboard and Dealers pages share one cached result and can never disagree.
 */
export function useDealerPopulation() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboardSummary({}),
    queryFn: () => services.analytics.getDashboardSummary({}),
    select: (summary) => summary.dealers,
  })
}
