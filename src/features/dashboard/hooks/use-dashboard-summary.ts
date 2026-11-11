import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { EntityId } from '@/types'

/** Platform totals, or a single dealer's totals when `dealerId` is set. */
export function useDashboardSummary(dealerId?: EntityId) {
  const params = dealerId ? { dealerId } : {}
  return useQuery({
    queryKey: queryKeys.analytics.dashboardSummary(params),
    queryFn: () => services.analytics.getDashboardSummary(params),
    placeholderData: keepPreviousData,
  })
}
