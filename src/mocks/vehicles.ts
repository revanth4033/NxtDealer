import type { AiReel, BodyType, DealerStatus, FuelType, GarageVehicle, Transmission } from '@/types'

import { mockDealerProfiles } from './dealers'
import { ALTERNATE_PHOTO_SETS, type AlternatePhotoSet } from './vehicle-photo-alternates'
import { VEHICLE_PHOTO_SETS, type PhotoSet } from './vehicle-photos'

/*
 * Deterministic garage inventory and AI reels.
 * ------------------------------------------------------------
 * Every vehicle is a garage vehicle; some are published to the marketplace.
 * Reels reference a vehicle, and a vehicle can have several reels.
 * A seeded PRNG keeps the data identical between reloads.
 */

/** Fixture anchor, kept safely in the past so no generated timestamp is in the future. */
const TODAY = Date.UTC(2026, 10, 10, 12, 0)
const DAY = 86_400_000

/** mulberry32 — tiny deterministic PRNG. */
function createRandom(seed: number) {
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    /** Fisher–Yates shuffle into a new array. */
    shuffle: <T,>(items: readonly T[]): T[] => {
      const copy = [...items]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    },
  }
}

interface CatalogEntry {
  make: string
  model: string
  variants: string[]
  body: BodyType
  fuels: FuelType[]
  transmissions: Transmission[]
  /** Approximate new ex-showroom price in lakh. */
  newPriceLakh: number
}

const CATALOG: CatalogEntry[] = [
  { make: 'Maruti Suzuki', model: 'Swift', variants: ['VXI', 'ZXI', 'ZXI+'], body: 'hatchback', fuels: ['petrol', 'cng'], transmissions: ['manual', 'automatic'], newPriceLakh: 8 },
  { make: 'Maruti Suzuki', model: 'Baleno', variants: ['Delta', 'Zeta', 'Alpha'], body: 'hatchback', fuels: ['petrol'], transmissions: ['manual', 'automatic'], newPriceLakh: 9 },
  { make: 'Hyundai', model: 'i20', variants: ['Sportz', 'Asta', 'Asta (O)'], body: 'hatchback', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 10 },
  { make: 'Tata', model: 'Altroz', variants: ['XM+', 'XZ', 'XZ+'], body: 'hatchback', fuels: ['petrol', 'diesel'], transmissions: ['manual'], newPriceLakh: 9 },
  { make: 'Volkswagen', model: 'Polo', variants: ['Comfortline', 'Highline Plus'], body: 'hatchback', fuels: ['petrol'], transmissions: ['manual', 'automatic'], newPriceLakh: 9.5 },
  { make: 'Honda', model: 'City', variants: ['V', 'VX', 'ZX CVT'], body: 'sedan', fuels: ['petrol', 'hybrid'], transmissions: ['manual', 'automatic'], newPriceLakh: 14 },
  { make: 'Hyundai', model: 'Verna', variants: ['SX', 'SX(O)'], body: 'sedan', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 15 },
  { make: 'Maruti Suzuki', model: 'Ciaz', variants: ['Zeta', 'Alpha'], body: 'sedan', fuels: ['petrol'], transmissions: ['manual', 'automatic'], newPriceLakh: 11 },
  { make: 'Skoda', model: 'Slavia', variants: ['Ambition', 'Style'], body: 'sedan', fuels: ['petrol'], transmissions: ['manual', 'automatic'], newPriceLakh: 15 },
  { make: 'Maruti Suzuki', model: 'Dzire', variants: ['VXI', 'ZXI'], body: 'sedan', fuels: ['petrol', 'cng'], transmissions: ['manual'], newPriceLakh: 8.5 },
  { make: 'Hyundai', model: 'Creta', variants: ['S', 'SX', 'SX(O) Turbo'], body: 'suv', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 17 },
  { make: 'Kia', model: 'Seltos', variants: ['HTK+', 'HTX', 'HTX+'], body: 'suv', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 17 },
  { make: 'Tata', model: 'Nexon', variants: ['XM', 'XZ+', 'XZA+'], body: 'suv', fuels: ['petrol', 'diesel', 'electric'], transmissions: ['manual', 'automatic'], newPriceLakh: 12 },
  { make: 'Mahindra', model: 'XUV700', variants: ['AX5', 'AX7', 'AX7 L'], body: 'suv', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 22 },
  { make: 'Toyota', model: 'Fortuner', variants: ['4x2 AT', '4x4 AT'], body: 'suv', fuels: ['diesel'], transmissions: ['automatic'], newPriceLakh: 40 },
  { make: 'Maruti Suzuki', model: 'Brezza', variants: ['VXI', 'ZXI+'], body: 'suv', fuels: ['petrol', 'cng'], transmissions: ['manual', 'automatic'], newPriceLakh: 11 },
  { make: 'Kia', model: 'Sonet', variants: ['HTK+', 'GTX+'], body: 'suv', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 11 },
  { make: 'Toyota', model: 'Innova Crysta', variants: ['2.4 G', '2.4 VX', '2.4 ZX'], body: 'mpv', fuels: ['diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 22 },
  { make: 'Maruti Suzuki', model: 'Ertiga', variants: ['VXI', 'ZXI'], body: 'mpv', fuels: ['petrol', 'cng'], transmissions: ['manual', 'automatic'], newPriceLakh: 10 },
  { make: 'Kia', model: 'Carens', variants: ['Prestige', 'Luxury Plus'], body: 'mpv', fuels: ['petrol', 'diesel'], transmissions: ['manual', 'automatic'], newPriceLakh: 15 },
  { make: 'Maruti Suzuki', model: 'XL6', variants: ['Zeta', 'Alpha+'], body: 'mpv', fuels: ['petrol'], transmissions: ['manual', 'automatic'], newPriceLakh: 13 },
]

const REEL_DURATION_SECONDS = 6 // Length of the generated mock videos.

/**
 * Photos are shared across many mock vehicles, so they're handed out round-robin per model —
 * cycling through colour sets and which angle is the cover — to keep neighbouring cars visually distinct.
 */
function createPhotoAssigner() {
  const cursor = new Map<string, number>()
  return (entry: CatalogEntry): { set: PhotoSet; photos: string[] } => {
    const name = `${entry.make} ${entry.model}`
    const sets = VEHICLE_PHOTO_SETS[name]
    if (!sets?.length) throw new Error(`No photo sets for ${name}`)
    const variants = sets.flatMap((set) => set.photos.map((_, cover) => ({ set, cover })))
    const index = cursor.get(name) ?? 0
    cursor.set(name, index + 1)
    const { set, cover } = variants[index % variants.length]
    return { set, photos: [...set.photos.slice(cover), ...set.photos.slice(0, cover)] }
  }
}

/**
 * How much inventory each dealer has. Explicit plans and garage-only scenarios cover the cases the
 * dashboard must handle; other dealers are derived from their account status.
 *   garage: vehicles in the garage · published: of those, on the marketplace
 *   reelVehicles: vehicles with reels · maxReels: most reels on a single vehicle
 */
interface InventoryPlan {
  garage: number
  published: number
  reelVehicles: number
  maxReels: number
}

const EXPLICIT_PLANS: Record<string, InventoryPlan> = {
  dlr_1001: { garage: 34, published: 18, reelVehicles: 7, maxReels: 3 }, // large garage, multiple reels per vehicle
  dlr_1002: { garage: 16, published: 9, reelVehicles: 0, maxReels: 0 }, // active, publishes, never made a reel
  dlr_1003: { garage: 5, published: 0, reelVehicles: 0, maxReels: 0 }, // joined recently: garage only, nothing published yet
  dlr_1004: { garage: 46, published: 22, reelVehicles: 9, maxReels: 3 }, // largest garage
  dlr_1005: { garage: 12, published: 0, reelVehicles: 2, maxReels: 2 }, // suspended: delisted, old reels remain
  dlr_1006: { garage: 21, published: 11, reelVehicles: 4, maxReels: 2 },
  dlr_1007: { garage: 3, published: 0, reelVehicles: 0, maxReels: 0 }, // small garage, not using the marketplace
  dlr_1008: { garage: 28, published: 15, reelVehicles: 6, maxReels: 2 },
  dlr_1110: { garage: 0, published: 0, reelVehicles: 0, maxReels: 0 }, // joined, nothing added yet
}

/**
 * Active dealers who keep vehicles in their garage but have nothing on the marketplace. These are
 * inventory scenarios, not account statuses: "starter" has a small garage and no reels yet,
 * "lapsed" has a modest garage and at most an old reel.
 */
const GARAGE_ONLY: Record<string, 'starter' | 'lapsed'> = {
  dlr_1104: 'starter',
  dlr_1106: 'lapsed',
  dlr_1112: 'starter',
  dlr_1114: 'lapsed',
}

function planFor(dealerId: string, status: DealerStatus, random: ReturnType<typeof createRandom>): InventoryPlan {
  const explicit = EXPLICIT_PLANS[dealerId]
  if (explicit) return explicit
  const garageOnly = GARAGE_ONLY[dealerId]
  if (garageOnly === 'starter') return { garage: random.int(1, 4), published: 0, reelVehicles: 0, maxReels: 0 }
  if (status === 'active' && !garageOnly) {
    const garage = random.int(6, 22)
    const published = Math.round(garage * (0.3 + random.next() * 0.4))
    const reelVehicles = random.next() < 0.25 ? 0 : random.int(1, Math.min(5, garage))
    return { garage, published, reelVehicles, maxReels: 2 }
  }
  // Suspended (and lapsed) dealers keep their garage, but nothing stays on the marketplace.
  return { garage: random.int(2, 8), published: 0, reelVehicles: random.int(0, 1), maxReels: 1 }
}

const roundTo = (value: number, step: number) => Math.round(value / step) * step

const ALTERNATES_BY_SET = new Map<string, AlternatePhotoSet[]>()
for (const set of ALTERNATE_PHOTO_SETS) ALTERNATES_BY_SET.set(set.baseSet, [...(ALTERNATES_BY_SET.get(set.baseSet) ?? []), set])

/** Every ordering of a photo list that starts at a different photo (the cover). */
const rotations = (photos: readonly string[]) => photos.map((_, i) => [...photos.slice(i), ...photos.slice(0, i)])

/**
 * Display-only pass over one dealer's finished vehicles: where two vehicles would show the same cover
 * photo, the later one gets another cover — first a different photo from its own colour set, then (if it
 * has no reels, whose video is made from its set) an alternate set of the same model and colour.
 * Only `photos` changes; which vehicles exist, are published or have reels was decided before this runs.
 * Repeats remain only when a dealer has more cars of a model and colour than there are photos.
 */
function assignDistinctCovers(vehicles: GarageVehicle[], setByVehicle: ReadonlyMap<string, PhotoSet>) {
  const usedCovers = new Set<string>()
  // Vehicles with reels can only use their own set, so they choose first; the rest can fall back to alternates.
  const byFlexibility = [...vehicles].sort((a, b) => Number(b.aiReelCount > 0) - Number(a.aiReelCount > 0))
  for (const vehicle of byFlexibility) {
    if (vehicle.photos.length === 0) continue
    const set = setByVehicle.get(vehicle.id)!
    const alternates = vehicle.aiReelCount === 0 ? (ALTERNATES_BY_SET.get(set.key) ?? []) : []
    // The vehicle's current photos come first, so a cover only changes when it would repeat.
    const options = [vehicle.photos, ...rotations(set.photos), ...alternates.flatMap((alternate) => rotations(alternate.photos))]
    const distinct = options.find((photos) => !usedCovers.has(photos[0]))
    if (distinct) vehicle.photos = distinct
    usedCovers.add(vehicle.photos[0])
  }
}

const iso = (time: number) => new Date(time).toISOString()

function buildInventory() {
  const vehicles: GarageVehicle[] = []
  const reels: AiReel[] = []
  let vehicleSeq = 1
  let reelSeq = 1
  const photoSetByVehicle = new Map<string, PhotoSet>()
  const assignPhotos = createPhotoAssigner()

  mockDealerProfiles.forEach((dealer, dealerIndex) => {
    const random = createRandom(7919 * (dealerIndex + 1))
    const plan = planFor(dealer.id, dealer.status, random)
    const joined = Date.parse(dealer.joinedAt)
    const dealerVehicles: GarageVehicle[] = []

    for (let i = 0; i < plan.garage; i++) {
      const entry = random.pick(CATALOG)
      const year = random.int(2015, 2024)
      const age = 2026 - year
      const odometerKm = roundTo(age * random.int(6500, 14500) + random.int(0, 4000), 100)
      const depreciation = Math.pow(0.87, age) * (1 - Math.min(0.12, odometerKm / 1_000_000))
      const price = roundTo(entry.newPriceLakh * 100_000 * depreciation, 5000)
      const { set: photoSet, photos: photoOrder } = assignPhotos(entry)
      const variant = random.pick(entry.variants)
      // A few vehicles have no photos yet, so image fallbacks are exercised.
      const hasPhotos = random.next() > 0.05
      const vehicleId = `veh_${String(vehicleSeq++).padStart(4, '0')}`
      if (hasPhotos) photoSetByVehicle.set(vehicleId, photoSet)
      const addedAt = Math.max(joined, TODAY - random.int(2, 420) * DAY) + random.int(0, 36_000_000)

      dealerVehicles.push({
        id: vehicleId,
        dealerId: dealer.id,
        dealerName: dealer.businessName,
        title: `${year} ${entry.make} ${entry.model} ${variant}`,
        specs: {
          make: entry.make,
          model: entry.model,
          variant,
          year,
          bodyType: entry.body,
          fuelType: random.pick(entry.fuels),
          transmission: random.pick(entry.transmissions),
          odometerKm,
          colour: photoSet.colour,
          owners: age > 6 ? random.int(1, 3) : random.int(1, 2),
        },
        price: { amount: price, currency: 'INR' },
        city: dealer.location.city,
        photos: hasPhotos ? photoOrder : [],
        marketplace: { status: 'unpublished' },
        aiReelCount: 0,
        addedAt: iso(Math.min(addedAt, TODAY - DAY)),
      })
    }

    // Publish the requested number of vehicles (photos are required to publish).
    const publishable = dealerVehicles.filter((vehicle) => vehicle.photos.length > 0)
    publishable.slice(0, plan.published).forEach((vehicle) => {
      const added = Date.parse(vehicle.addedAt)
      // Usually published within two weeks of being added, never after the anchor date.
      const latest = Math.min(TODAY - 3_600_000, added + 14 * DAY)
      const publishedAt = added + random.next() * (latest - added)
      vehicle.marketplace = { status: 'published', publishedAt: iso(publishedAt) }
    })

    // Reels are generated from several photos of a vehicle; some vehicles get several reels.
    const reelCandidates = random.shuffle(publishable.filter((vehicle) => vehicle.photos.length >= 2)).slice(0, plan.reelVehicles)
    reelCandidates.forEach((vehicle) => {
      const count = random.int(1, Math.max(1, plan.maxReels))
      const mediaKey = photoSetByVehicle.get(vehicle.id)!.key
      // Spread this vehicle's reels between the day it was added and the anchor date.
      const earliest = Date.parse(vehicle.addedAt) + 3_600_000
      const span = Math.max(0, TODAY - 3_600_000 - earliest)
      const times = Array.from({ length: count }, () => earliest + random.next() * span).sort((a, b) => a - b)
      for (const createdAt of times) {
        reels.push({
          id: `rel_${String(reelSeq++).padStart(4, '0')}`,
          dealerId: dealer.id,
          dealerName: dealer.businessName,
          vehicleId: vehicle.id,
          vehicleTitle: vehicle.title,
          durationSeconds: REEL_DURATION_SECONDS,
          thumbnailUrl: `/mock-media/reels/${mediaKey}.jpg`,
          videoUrl: `/mock-media/reels/${mediaKey}.mp4`,
          createdAt: iso(createdAt),
        })
      }
      vehicle.aiReelCount = count
    })

    assignDistinctCovers(dealerVehicles, photoSetByVehicle)
    vehicles.push(...dealerVehicles)
  })

  return { vehicles, reels }
}

const inventory = buildInventory()

export const mockVehicles: GarageVehicle[] = inventory.vehicles
export const mockAiReels: AiReel[] = inventory.reels
