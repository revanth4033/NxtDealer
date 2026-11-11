import type { BodyType, FuelType, Transmission } from '@/types'

export const FUEL_LABELS: Record<FuelType, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  cng: 'CNG',
  electric: 'Electric',
  hybrid: 'Hybrid',
}

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  manual: 'Manual',
  automatic: 'Automatic',
}

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV',
  mpv: 'MPV',
}
