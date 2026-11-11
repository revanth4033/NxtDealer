import { BrandMark } from '@/components/common/brand-mark'
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation'

import { SidebarNavLink } from './sidebar-nav-link'

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

      <nav aria-label="Primary" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {PRIMARY_NAV.map((section) => (
          <div key={section.id} className="space-y-1">
            {section.label && (
              <p className="px-3 pb-1 text-overline uppercase text-muted-foreground">{section.label}</p>
            )}
            {section.items.map((item) => (
              <SidebarNavLink key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-sidebar-border px-3 py-3">
        {SECONDARY_NAV.map((item) => (
          <SidebarNavLink key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}
