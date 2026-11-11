import type { Showroom } from '@/types'

/**
 * The NxtDealer app currently supports one showroom per dealer, so the portal shows a single showroom:
 * the first one registered. The data model and service already return every showroom for a dealer;
 * when the app adds branches, render the whole list instead of calling this.
 */
export function currentShowroom(showrooms: readonly Showroom[]): Showroom | undefined {
  return showrooms[0]
}
