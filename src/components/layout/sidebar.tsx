import { cn } from '@/lib/utils'

import { SidebarContent } from './sidebar-content'

/** Fixed desktop navigation rail. Hidden below the `lg` breakpoint, where MobileNav takes over. */
export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden w-sidebar border-r border-sidebar-border bg-sidebar lg:block',
        className,
      )}
    >
      <SidebarContent />
    </aside>
  )
}
