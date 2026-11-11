import { NavLink } from 'react-router'

import type { NavItem } from '@/config/navigation'
import { cn } from '@/lib/utils'

interface SidebarNavLinkProps {
  item: NavItem
  onNavigate?: () => void
}

/**
 * Sidebar link. Active: blush background, pink icon, dark-pink label and an edge marker.
 * Inactive: secondary text with a neutral hover — pink is reserved for the current location.
 */
export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
  const { icon: Icon, label, path } = item

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none',
          'transition-colors duration-150 ease-out-soft',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring/30',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-2 -left-3 w-[3px] rounded-r-full bg-sidebar-primary transition-transform duration-200 ease-out-soft',
              isActive ? 'scale-y-100' : 'scale-y-0',
            )}
          />
          <Icon
            aria-hidden
            className={cn(
              'size-[18px] shrink-0 transition-colors duration-150',
              isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-foreground-secondary',
            )}
            strokeWidth={isActive ? 2 : 1.75}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
