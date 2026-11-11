import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { AiReelListParams, EntityId } from '@/types'

export function useAiReels(params: AiReelListParams = {}) {
  return useQuery({
    queryKey: queryKeys.aiReels.list(params),
    queryFn: () => services.aiReels.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useAiReel(id: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.aiReels.detail(id ?? ''),
    queryFn: () => services.aiReels.getById(id as EntityId),
    enabled: Boolean(id),
  })
}
