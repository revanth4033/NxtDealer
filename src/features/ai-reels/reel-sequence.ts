import type { AiReel } from '@/types'

/**
 * For each reel, its position among reels of the same vehicle ("Reel 2 of 3").
 * Only reels in `reels` are considered, so pass the complete set for a dealer or vehicle.
 */
export function getReelSequenceLabels(reels: readonly AiReel[]): Map<string, string> {
  const byVehicle = new Map<string, AiReel[]>()
  for (const reel of reels) {
    byVehicle.set(reel.vehicleId, [...(byVehicle.get(reel.vehicleId) ?? []), reel])
  }
  const labels = new Map<string, string>()
  for (const group of byVehicle.values()) {
    if (group.length < 2) continue
    const ordered = [...group].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    ordered.forEach((reel, index) => labels.set(reel.id, `Reel ${index + 1} of ${ordered.length}`))
  }
  return labels
}
