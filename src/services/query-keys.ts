import type { AiReelListParams, DealerListParams, EntityId, ListingListParams } from '@/types'

/**
 * Centralised TanStack Query keys. Hierarchical so whole domains can be
 * invalidated at once, e.g. queryClient.invalidateQueries({ queryKey: queryKeys.dealers.all }).
 */
export const queryKeys = {
  dealers: {
    all: ['dealers'] as const,
    list: (params: DealerListParams = {}) => ['dealers', 'list', params] as const,
    detail: (id: EntityId) => ['dealers', 'detail', id] as const,
  },
  listings: {
    all: ['listings'] as const,
    list: (params: ListingListParams = {}) => ['listings', 'list', params] as const,
    detail: (id: EntityId) => ['listings', 'detail', id] as const,
  },
  aiReels: {
    all: ['ai-reels'] as const,
    list: (params: AiReelListParams = {}) => ['ai-reels', 'list', params] as const,
    detail: (id: EntityId) => ['ai-reels', 'detail', id] as const,
  },
  analytics: {
    dashboardSummary: ['analytics', 'dashboard-summary'] as const,
  },
  session: {
    currentAdmin: ['session', 'current-admin'] as const,
  },
}
