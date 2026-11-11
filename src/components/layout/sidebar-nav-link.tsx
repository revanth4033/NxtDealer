import { NavLink } from 'react-router'

import type { NavItem } from '@/config/navigation'
import { cn } from '@/lib/utils'

interface SidebarNavLinkProps {
  item: NavItem
  onNavigate?: () => void
}

export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
  const { icon: Icon, label, path } = item

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring/40',
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
              'absolute inset-y-2 -left-3 w-0.5 rounded-r-full bg-sidebar-primary transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Icon
            className={cn(
              'size-[18px] shrink-0 transition-colors',
              isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-foreground',
            )}
            strokeWidth={1.75}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
