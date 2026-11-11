import type { EntityId, ISODateString, ListParams, Money } from './common'

export type ListingStatus = 'live' | 'draft' | 'sold' | 'flagged' | 'expired'

export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid'

export type Transmission = 'manual' | 'automatic'

export interface VehicleDetails {
  make: string
  model: string
  variant?: string
  year: number
  fuelType: FuelType
  transmission: Transmission
  odometerKm: number
}

export interface MarketplaceListing {
  id: EntityId
  dealerId: EntityId
  dealerName: string
  title: string
  vehicle: VehicleDetails
  price: Money
  city: string
  status: ListingStatus
  views: number
  leads: number
  thumbnailUrl?: string
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type ListingSortField = 'createdAt' | 'price' | 'views' | 'leads'

export interface ListingListParams extends ListParams<ListingSortField> {
  status?: ListingStatus
  dealerId?: EntityId
}
