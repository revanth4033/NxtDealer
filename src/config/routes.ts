/** Single source of truth for route paths. Never hard-code paths in components. */
export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  dealers: '/dealers',
  marketplace: '/marketplace',
  aiReels: '/ai-reels',
  settings: '/settings',
  /** Development-only component reference. Not registered in production builds. */
  uiKit: '/ui-kit',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
