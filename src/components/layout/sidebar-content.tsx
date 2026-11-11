import { BrandMark } from '@/components/common/brand-mark'
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation'

import { SidebarNavLink } from './sidebar-nav-link'
import { UserMenu } from './user-menu'

interface SidebarContentProps {
  /** Called after a link is chosen — used by the mobile sheet to close itself. */
  onNavigate?: () => void
}

/** Sidebar body, shared by the desktop rail and the mobile navigation sheet. */
export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-topbar shrink-0 items-center border-b border-sidebar-border px-5">
        <BrandMark />
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-6 overflow-y-auto px-3 pt-5 pb-6">
        {PRIMARY_NAV.map((section) => (
          <div key={section.id} role="group" aria-labelledby={section.label ? `nav-${section.id}` : undefined}>
            {section.label && (
              <p id={`nav-${section.id}`} className="px-3 pb-2 text-caption font-medium text-muted-foreground">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <SidebarNavLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-sidebar-border p-3">
        <ul className="space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <li key={item.path}>
              <SidebarNavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
        <UserMenu variant="sidebar" />
      </div>
    </div>
  )
}
