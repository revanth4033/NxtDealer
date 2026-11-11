import type {
  AiReelStatus,
  DealerPlan,
  DealerStatus,
  DealerVerificationStatus,
  ListingStatus,
} from '@/types'

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
  pending: { label: 'Pending', tone: 'warning' },
  suspended: { label: 'Suspended', tone: 'danger' },
  inactive: { label: 'Inactive', tone: 'neutral' },
}

export const DEALER_VERIFICATION: Record<DealerVerificationStatus, StatusMeta> = {
  verified: { label: 'Verified', tone: 'success' },
  in_review: { label: 'In review', tone: 'info' },
  unverified: { label: 'Unverified', tone: 'neutral' },
  rejected: { label: 'Rejected', tone: 'danger' },
}

export const DEALER_PLAN: Record<DealerPlan, StatusMeta> = {
  free: { label: 'Free', tone: 'neutral' },
  growth: { label: 'Growth', tone: 'info' },
  pro: { label: 'Pro', tone: 'brand' },
}

export const LISTING_STATUS: Record<ListingStatus, StatusMeta> = {
  live: { label: 'Live', tone: 'success' },
  draft: { label: 'Draft', tone: 'neutral' },
  sold: { label: 'Sold', tone: 'info' },
  flagged: { label: 'Flagged', tone: 'danger' },
  expired: { label: 'Expired', tone: 'warning' },
}

export const AI_REEL_STATUS: Record<AiReelStatus, StatusMeta> = {
  queued: { label: 'Queued', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
}

/** Turns a status map into filter/tab options, preserving declaration order. */
export function toOptions<T extends string>(map: Record<T, StatusMeta>): { value: T; label: string }[] {
  return (Object.entries(map) as [T, StatusMeta][]).map(([value, meta]) => ({ value, label: meta.label }))
}
