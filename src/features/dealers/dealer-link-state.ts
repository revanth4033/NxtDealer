/**
 * Router state carried by links into a dealer's details page, so its visible back link returns the admin
 * to where they came from. Browser Back works regardless; this only affects the on-page link.
 */
export interface DealerLinkState {
  /** Query string of the Dealers directory, restoring its search, filters, sort and page. */
  directorySearch?: string
  /** Any other origin, e.g. a filtered Marketplace view. Takes precedence over the directory. */
  returnTo?: { path: string; label: string }
}

/** Reads the state defensively: it comes from history and may be missing or from an older version. */
export function readDealerLinkState(state: unknown): DealerLinkState {
  if (!state || typeof state !== 'object') return {}
  const { directorySearch, returnTo } = state as DealerLinkState
  return {
    directorySearch: typeof directorySearch === 'string' && directorySearch.startsWith('?') ? directorySearch : undefined,
    returnTo:
      returnTo && typeof returnTo.path === 'string' && returnTo.path.startsWith('/') && typeof returnTo.label === 'string'
        ? returnTo
        : undefined,
  }
}
