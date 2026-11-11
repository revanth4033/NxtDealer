import { useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboardSummary,
    queryFn: () => services.analytics.getDashboardSummary(),
  })
}
