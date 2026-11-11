import { appConfig } from '@/config/app'
import type { ISODateString, Money } from '@/types'

const { locale, timeZone } = appConfig

const numberFormatter = new Intl.NumberFormat(locale)
const compactFormatter = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 })
const dateFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone })
const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone,
})

export const formatNumber = (value: number) => numberFormatter.format(value)

/** 12,400 → "12.4K" (en-IN uses lakh/crore: 1,25,000 → "1.3L") */
export const formatCompact = (value: number) => compactFormatter.format(value)

export function formatMoney({ amount, currency }: Money, options: { compact?: boolean } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    ...(options.compact ? { notation: 'compact' } : {}),
  }).format(amount)
}

export const formatDate = (iso: ISODateString) => dateFormatter.format(new Date(iso))

const LAKH = 100_000
const CRORE = 10_000_000

/** Indian price shorthand used across vehicle UIs: 1525000 → "₹15.25 L", 12500000 → "₹1.25 Cr". */
export function formatPriceShort({ amount }: Money) {
  if (amount >= CRORE) return `₹${trimDecimals(amount / CRORE)} Cr`
  if (amount >= LAKH) return `₹${trimDecimals(amount / LAKH)} L`
  return `₹${numberFormatter.format(amount)}`
}

const trimDecimals = (value: number) => value.toFixed(2).replace(/\.?0+$/, '')

/** 28400 → "28,400 km" */
export const formatKm = (km: number) => `${numberFormatter.format(km)} km`

/** 75 → "1:15" */
export const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`

const relativeFormatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 86_400_000],
  ['month', 30 * 86_400_000],
  ['week', 7 * 86_400_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

/** "3 days ago", "yesterday", "2 hours ago". */
export function formatRelative(iso: ISODateString, now: number = Date.now()) {
  const diff = new Date(iso).getTime() - now
  // Future timestamps (clock skew between server and browser) read as "just now", never "in 5 minutes".
  if (diff > -60_000) return 'just now'
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms || unit === 'minute') return relativeFormatter.format(Math.round(diff / ms), unit)
  }
  return relativeFormatter.format(0, 'minute')
}

const ordinalRules = new Intl.PluralRules('en-IN', { type: 'ordinal' })
const ORDINAL_SUFFIX: Record<Intl.LDMLPluralRule, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th', zero: 'th', many: 'th' }

/** 1 → "1st", 2 → "2nd" */
export const formatOrdinal = (value: number) => `${value}${ORDINAL_SUFFIX[ordinalRules.select(value)]}`

/** part/whole as a whole-number percentage string; "0%" when whole is 0. */
export const formatShare = (part: number, whole: number) => `${whole === 0 ? 0 : Math.round((part / whole) * 100)}%`

export const formatDateTime = (iso: ISODateString) => dateTimeFormatter.format(new Date(iso))

/** "Admin User" → "AU" */
export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
