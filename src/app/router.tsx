import { createBrowserRouter, Navigate } from 'react-router'

import { AppShell } from '@/components/layout/app-shell'
import { NAV_ITEMS } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { AppLoader } from '@/pages/app-loader'
import { NotFoundPage } from '@/pages/not-found-page'
import { RouteErrorPage } from '@/pages/route-error-page'

import type { RouteHandle } from './route-handle'

const handle = (title: string): RouteHandle => ({ title })

/**
 * Application routes. Page modules are lazy-loaded so each route ships as its own chunk.
 * Paths come from config/routes.ts; titles come from config/navigation.ts.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    Component: AppShell,
    HydrateFallback: AppLoader,
    ErrorBoundary: RouteErrorPage,
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      {
        path: ROUTES.dashboard,
        handle: handle(NAV_ITEMS.dashboard.label),
        lazy: async () => ({ Component: (await import('@/pages/dashboard-page')).DashboardPage }),
      },
      {
        path: ROUTES.dealers,
        handle: handle(NAV_ITEMS.dealers.label),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/dealers-page')).DealersPage }),
          },
          {
            path: ROUTES.dealerDetails,
            handle: handle('Dealer details'),
            lazy: async () => ({ Component: (await import('@/pages/dealer-details-page')).DealerDetailsPage }),
          },
        ],
      },
      {
        path: ROUTES.marketplace,
        handle: handle(NAV_ITEMS.marketplace.label),
        lazy: async () => ({ Component: (await import('@/pages/marketplace-page')).MarketplacePage }),
      },
      {
        path: ROUTES.aiReels,
        handle: handle(NAV_ITEMS.aiReels.label),
        lazy: async () => ({ Component: (await import('@/pages/ai-reels-page')).AiReelsPage }),
      },
      {
        path: ROUTES.settings,
        handle: handle(NAV_ITEMS.settings.label),
        lazy: async () => ({ Component: (await import('@/pages/settings-page')).SettingsPage }),
      },
      // Development-only component library. `import.meta.env.DEV` (not env.isDev) lets the
      // bundler statically remove this route and its chunk from production builds.
      ...(import.meta.env.DEV
        ? [
            {
              path: ROUTES.uiKit,
              handle: handle(NAV_ITEMS.uiKit.label),
              lazy: async () => ({ Component: (await import('@/pages/ui-kit/ui-kit-page')).UiKitPage }),
            },
          ]
        : []),
      { path: '*', handle: handle('Page not found'), Component: NotFoundPage },
    ],
  },
])
