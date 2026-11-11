import { Outlet } from 'react-router'

import { useDocumentTitle } from '@/hooks/use-document-title'
import { useRouteMeta } from '@/hooks/use-route-meta'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

/** Root authenticated layout: fixed sidebar, sticky topbar, scrollable content column. */
export function AppShell() {
  const meta = useRouteMeta()
  useDocumentTitle(meta?.title)

  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-col lg:pl-sidebar">
        <Topbar />
        <main id="main-content" className="flex-1">
          <div className="mx-auto w-full max-w-content px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
