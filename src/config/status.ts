import type { DealerPlan, DealerStatus, MarketplaceStatus, ShowroomStatus } from '@/types'

/** Visual tone of a status. Maps 1:1 to StatusBadge styles. */
export type StatusTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export interface StatusMeta {
  label: string
  tone: StatusTone
}

/*
 * Single source of truth for how every domain status is labelled and coloured.
 * Keeps wording and colour consistent across tables, badges and filters.
 */

export const DEALER_STATUS: Record<DealerStatus, StatusMeta> = {
  active: { label: 'Active', tone: 'success' },
  suspended: { label: 'Suspended', tone: 'danger' },
}

export const DEALER_PLAN: Record<DealerPlan, StatusMeta> = {
  free: { label: 'Free', tone: 'neutral' },
  growth: { label: 'Growth', tone: 'info' },
  pro: { label: 'Pro', tone: 'brand' },
}

/** A showroom's own status, independent of its dealer's account status. */
export const SHOWROOM_STATUS: Record<ShowroomStatus, StatusMeta> = {
  active: { label: 'Active', tone: 'success' },
  suspended: { label: 'Suspended', tone: 'danger' },
}

/** Pink (brand) marks marketplace presence throughout the portal. */
export const MARKETPLACE_STATUS: Record<MarketplaceStatus, StatusMeta> = {
  published: { label: 'Published', tone: 'brand' },
  unpublished: { label: 'Not published', tone: 'neutral' },
}

/** Turns a status map into filter/tab options, preserving declaration order. */
export function toOptions<T extends string>(map: Record<T, StatusMeta>): { value: T; label: string }[] {
  return (Object.entries(map) as [T, StatusMeta][]).map(([value, meta]) => ({ value, label: meta.label }))
}
