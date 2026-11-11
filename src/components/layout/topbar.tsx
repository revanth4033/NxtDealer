import { ChevronRight } from 'lucide-react'

import { DataSourceIndicator } from '@/components/common/data-source-indicator'
import { BrandMark } from '@/components/common/brand-mark'
import { useRouteMeta } from '@/hooks/use-route-meta'

import { MobileNav } from './mobile-nav'
import { UserMenu } from './user-menu'

export function Topbar() {
  const meta = useRouteMeta()

  return (
    <header className="sticky top-0 z-30 flex h-topbar shrink-0 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-card/85 sm:px-6 lg:px-8">
      <MobileNav />
      <BrandMark compact className="lg:hidden" />

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex">
        <span className="text-muted-foreground">Admin</span>
        {meta?.title && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground/70" />
            <span className="truncate font-medium text-foreground">{meta.title}</span>
          </>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <DataSourceIndicator className="hidden sm:inline-flex" />
        <UserMenu />
      </div>
    </header>
  )
}
