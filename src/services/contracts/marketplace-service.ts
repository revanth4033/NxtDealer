import type {
  MarketplaceFacets,
  MarketplaceFilters,
  MarketplaceInsights,
  MarketplaceListParams,
  MarketplaceVehicle,
  PaginatedResponse,
} from '@/types'

/** The shared marketplace: garage vehicles that are currently published. Read-only for admins. */
export interface MarketplaceService {
  /** Filters, then searches, sorts and pages. Rejects an inverted range with a 400 `ApiError`. */
  list(params?: MarketplaceListParams): Promise<PaginatedResponse<MarketplaceVehicle>>
  /** Platform-wide totals and rankings over every published vehicle. */
  getInsights(): Promise<MarketplaceInsights>
  /** Faceted option counts for the given filters. Rejects an inverted range with a 400 `ApiError`. */
  getFacets(filters?: MarketplaceFilters): Promise<MarketplaceFacets>
}
