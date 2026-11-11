import { createContext, useContext, useEffect } from 'react'

/**
 * Runtime details a page can supply once its data has loaded, overriding the static route `handle`.
 * Example: the dealer details route is titled "Dealer details", but the page shows the dealer's name.
 */
export interface PageMeta {
  /** Replaces the current breadcrumb label and the document title. */
  title?: string
  /** Replaces the parent breadcrumb's link, e.g. to return to a filtered list. */
  parentPath?: string
}

interface PageMetaContextValue {
  meta: PageMeta
  setMeta: (meta: PageMeta) => void
}

export const PageMetaContext = createContext<PageMetaContextValue>({ meta: {}, setMeta: () => {} })

/** Sets the page's runtime title and parent link while the calling component is mounted. */
export function usePageMeta({ title, parentPath }: PageMeta) {
  const { setMeta } = useContext(PageMetaContext)
  useEffect(() => {
    setMeta({ title, parentPath })
    return () => setMeta({})
  }, [title, parentPath, setMeta])
}

/** The overrides set by the current page, read by the shell (breadcrumbs, document title). */
export function usePageMetaOverrides(): PageMeta {
  return useContext(PageMetaContext).meta
}
