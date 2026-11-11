import { appConfig } from '@/config/app'
import type { ISODateString, Money } from '@/types'

const { locale, timeZone } = appConfig

const numberFormatter = new Intl.NumberFormat(locale)
const compactFormatter = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 })
const percentFormatter = new Intl.NumberFormat(locale, {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})
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

/** 0.124 → "+12.4%" */
export const formatPercentChange = (ratio: number) => percentFormatter.format(ratio)

export function formatMoney({ amount, currency }: Money, options: { compact?: boolean } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    ...(options.compact ? { notation: 'compact' } : {}),
  }).format(amount)
}

export const formatDate = (iso: ISODateString) => dateFormatter.format(new Date(iso))

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
