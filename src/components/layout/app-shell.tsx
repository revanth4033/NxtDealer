import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'

import { useDocumentTitle } from '@/hooks/use-document-title'
import { PageMetaContext, type PageMeta } from '@/hooks/use-page-meta'
import { useRouteMeta } from '@/hooks/use-route-meta'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

/** Root layout: fixed sidebar (desktop), sticky topbar, and a centred content column. */
export function AppShell() {
  const routeMeta = useRouteMeta()
  const [pageMeta, setPageMeta] = useState<PageMeta>({})
  const pageMetaContext = useMemo(() => ({ meta: pageMeta, setMeta: setPageMeta }), [pageMeta])
  useDocumentTitle(pageMeta.title ?? routeMeta?.title)
  const mainRef = useMainFocusOnNavigation()

  return (
    <PageMetaContext value={pageMetaContext}>
      <div className="min-h-dvh bg-canvas">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-overlay focus:ring-2 focus:ring-ring/40 focus:outline-none"
        >
          Skip to content
        </a>
        {/* Scrolls to top on new pages and restores position on back/forward. */}
        <ScrollRestoration />
        <Sidebar />
        <div className="flex min-h-dvh min-w-0 flex-col lg:pl-sidebar">
          <Topbar />
          <main ref={mainRef} id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <div className="mx-auto w-full max-w-content px-4 pt-6 pb-12 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PageMetaContext>
  )
}

/** Moves focus to <main> after client-side navigation so screen readers announce the new page. */
function useMainFocusOnNavigation() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return mainRef
}
