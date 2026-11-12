import { BrandMark } from '@/components/common/brand-mark'
import { DataSourceIndicator } from '@/components/common/data-source-indicator'

import { Breadcrumbs } from './breadcrumbs'
import { MobileNav } from './mobile-nav'
import { UserMenu } from './user-menu'

/** Sticky top bar: where you are (breadcrumbs) on the left, environment and account on the right. */
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-topbar shrink-0 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur-md sm:px-gutter">
      <MobileNav />
      <BrandMark compact className="lg:hidden" />
      <span aria-hidden className="h-5 w-px bg-border lg:hidden" />

      <Breadcrumbs className="flex-1" />

      <div className="flex shrink-0 items-center gap-3">
        <DataSourceIndicator className="hidden sm:inline-flex" />
        <UserMenu variant="topbar" />
      </div>
    </header>
  )
}
