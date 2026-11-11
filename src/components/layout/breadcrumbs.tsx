import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router'

import { ROUTES } from '@/config/routes'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { usePageMetaOverrides } from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'

/** Route-driven breadcrumb trail. The dashboard is home; the last crumb is the current page. */
export function Breadcrumbs({ className }: { className?: string }) {
  const overrides = usePageMetaOverrides()
  const crumbs = useBreadcrumbs().map((crumb, index, all) => {
    // Pages can name the current crumb after loaded data (a dealer's name) and point the parent at a filtered list.
    if (index === all.length - 1 && overrides.title) return { ...crumb, label: overrides.title }
    if (index === all.length - 2 && overrides.parentPath) return { ...crumb, path: overrides.parentPath }
    return crumb
  })
  const isHome = crumbs.length === 1 && crumbs[0].path === ROUTES.dashboard

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-[0.8125rem]">
        {!isHome && (
          <li className="flex shrink-0 items-center gap-1.5">
            <Link
              to={ROUTES.dashboard}
              aria-label="Dashboard"
              className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              <Home className="size-3.5" strokeWidth={1.75} />
            </Link>
            <ChevronRight aria-hidden className="size-3.5 text-muted-foreground/60" />
          </li>
        )}
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1
          return (
            <li key={crumb.path} className="flex min-w-0 items-center gap-1.5">
              {isCurrent ? (
                <span aria-current="page" className="truncate text-foreground-secondary">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    to={crumb.path}
                    className="truncate rounded-sm text-muted-foreground transition-colors hover:text-foreground-secondary focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground/60" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
