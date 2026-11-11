import { mockListings } from '@/mocks/listings'
import { ApiError } from '@/services/errors'
import type { ListingService } from '@/services/contracts'
import type { ListingSortField, MarketplaceListing } from '@/types'

import { clone, queryCollection, simulateLatency } from './mock-utils'

const sortAccessors: Record<ListingSortField, (listing: MarketplaceListing) => string | number> = {
  createdAt: (l) => l.createdAt,
  price: (l) => l.price.amount,
  views: (l) => l.views,
  leads: (l) => l.leads,
}

export const mockListingService: ListingService = {
  async list(params = {}) {
    await simulateLatency()
    const filtered = mockListings.filter(
      (l) => (!params.status || l.status === params.status) && (!params.dealerId || l.dealerId === params.dealerId),
    )
    return queryCollection(filtered, params, {
      searchFields: [(l) => l.title, (l) => l.dealerName, (l) => l.city],
      sortAccessors,
    })
  },

  async getById(id) {
    await simulateLatency()
    const listing = mockListings.find((l) => l.id === id)
    if (!listing) throw ApiError.notFound('Listing', id)
    return clone(listing)
  },
}
