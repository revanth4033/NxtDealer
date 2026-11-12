import type {
  AiReelListParams,
  DashboardSummaryParams,
  DealerListParams,
  EntityId,
  GarageListParams,
  MarketplaceFilters,
  MarketplaceListParams,
} from '@/types'

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
  showrooms: {
    all: ['showrooms'] as const,
    byDealer: (dealerId: EntityId) => ['showrooms', 'by-dealer', dealerId] as const,
  },
  garage: {
    all: ['garage'] as const,
    list: (params: GarageListParams = {}) => ['garage', 'list', params] as const,
    detail: (id: EntityId) => ['garage', 'detail', id] as const,
  },
  marketplace: {
    all: ['marketplace'] as const,
    list: (params: MarketplaceListParams = {}) => ['marketplace', 'list', params] as const,
    insights: ['marketplace', 'insights'] as const,
    facets: (filters: MarketplaceFilters = {}) => ['marketplace', 'facets', filters] as const,
  },
  aiReels: {
    all: ['ai-reels'] as const,
    list: (params: AiReelListParams = {}) => ['ai-reels', 'list', params] as const,
    detail: (id: EntityId) => ['ai-reels', 'detail', id] as const,
  },
  analytics: {
    dashboardSummary: (params: DashboardSummaryParams = {}) => ['analytics', 'dashboard-summary', params] as const,
  },
  session: {
    currentAdmin: ['session', 'current-admin'] as const,
  },
}
