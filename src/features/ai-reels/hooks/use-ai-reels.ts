import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'
import type { AiReelListParams } from '@/types'

export function useAiReels(params: AiReelListParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.aiReels.list(params),
    queryFn: () => services.aiReels.list(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}
