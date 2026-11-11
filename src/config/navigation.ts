import {
  Blocks,
  LayoutDashboard,
  Settings,
  Sparkles,
  Store,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { ROUTES, type RoutePath } from './routes'

export interface NavItem {
  label: string
  path: RoutePath
  icon: LucideIcon
  description: string
}

export interface NavSection {
  id: string
  label?: string
  items: NavItem[]
}

export const NAV_ITEMS = {
  dashboard: {
    label: 'Dashboard',
    path: ROUTES.dashboard,
    icon: LayoutDashboard,
    description: 'Health and growth of the NxtDealer ecosystem at a glance.',
  },
  dealers: {
    label: 'Dealers',
    path: ROUTES.dealers,
    icon: Users,
    description: 'Onboarding, verification and activity of registered dealers.',
  },
  marketplace: {
    label: 'Marketplace',
    path: ROUTES.marketplace,
    icon: Store,
    description: 'Vehicle listings, moderation and buyer engagement.',
  },
  aiReels: {
    label: 'AI Reels',
    path: ROUTES.aiReels,
    icon: Sparkles,
    description: 'Generation pipeline and performance of AI-created vehicle reels.',
  },
  settings: {
    label: 'Settings',
    path: ROUTES.settings,
    icon: Settings,
    description: 'Portal preferences, admin access and integrations.',
  },
  /** Development-only route (see app/router.tsx). Deliberately not part of PRIMARY_NAV or SECONDARY_NAV. */
  uiKit: {
    label: 'Component library',
    path: ROUTES.uiKit,
    icon: Blocks,
    description: 'Reference for the shared components and patterns used across the portal.',
  },
} as const satisfies Record<string, NavItem>

/** Primary sidebar navigation, grouped into sections. */
export const PRIMARY_NAV: NavSection[] = [
  { id: 'overview', items: [NAV_ITEMS.dashboard] },
  {
    id: 'ecosystem',
    label: 'Ecosystem',
    items: [NAV_ITEMS.dealers, NAV_ITEMS.marketplace, NAV_ITEMS.aiReels],
  },
]

/** Navigation pinned to the bottom of the sidebar. */
export const SECONDARY_NAV: NavItem[] = [NAV_ITEMS.settings]
