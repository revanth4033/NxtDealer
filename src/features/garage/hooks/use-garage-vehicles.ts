import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { EntityId, GarageListParams } from '@/types'

export function useGarageVehicles(params: GarageListParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.garage.list(params),
    queryFn: () => services.garage.list(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}

export function useGarageVehicle(id: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.garage.detail(id ?? ''),
    queryFn: () => services.garage.getById(id as EntityId),
    enabled: Boolean(id),
  })
}
