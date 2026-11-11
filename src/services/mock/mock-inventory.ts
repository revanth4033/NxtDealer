import { mockDealerProfiles } from '@/mocks/dealers'
import { mockAiReels, mockVehicles } from '@/mocks/vehicles'
import type { Dealer, DealerInventoryStats, GarageVehicle, InventoryTotals } from '@/types'

/*
 * Derived views over the fixtures, computed once.
 * Counts are always derived from records so garage, marketplace and reel numbers can't drift apart.
 */

export function computeTotals(vehicles: readonly GarageVehicle[], reelVehicleIds: readonly string[]): InventoryTotals {
  const marketplaceVehicles = vehicles.filter((vehicle) => vehicle.marketplace.status === 'published').length
  return {
    garageVehicles: vehicles.length,
    marketplaceVehicles,
    unpublishedVehicles: vehicles.length - marketplaceVehicles,
    aiReels: reelVehicleIds.length,
    vehiclesWithReels: new Set(reelVehicleIds).size,
  }
}

function statsFor(dealerId: string): DealerInventoryStats {
  const vehicles = mockVehicles.filter((vehicle) => vehicle.dealerId === dealerId)
  return {
    garageVehicles: vehicles.length,
    marketplaceVehicles: vehicles.filter((vehicle) => vehicle.marketplace.status === 'published').length,
    aiReels: mockAiReels.filter((reel) => reel.dealerId === dealerId).length,
  }
}

export const mockDealers: Dealer[] = mockDealerProfiles.map((profile) => ({ ...profile, stats: statsFor(profile.id) }))
