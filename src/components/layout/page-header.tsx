import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  /** Small supporting detail beside the title, e.g. a record count. */
  meta?: ReactNode
  /** Right-aligned primary page actions. Keep to one primary button plus secondary actions. */
  actions?: ReactNode
  /**
   * Optional bottom slot, typically a line-variant TabsList. When present its bottom border
   * becomes the divider between header and content; otherwise the header draws its own.
   */
  children?: ReactNode
  className?: string
}

/** Top of every page: title, one-line purpose, actions, and an optional view switcher. */
export function PageHeader({ title, description, meta, actions, children, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-6', !children && 'border-b pb-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          {meta ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-page-title text-foreground">{title}</h1>
              {meta}
            </div>
          ) : (
            <h1 className="text-page-title text-foreground">{title}</h1>
          )}
          {description && <p className="max-w-2xl text-foreground-secondary">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  )
}
