import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  /** Right-aligned controls scoped to this section (filters, segment tabs, links). */
  actions?: ReactNode
  /** Heading level. Page sections use h2; nested groups inside a section use h3. */
  as?: 'h2' | 'h3'
  id?: string
  className?: string
}

/** Heading for a block of content within a page. Pair `id` with aria-labelledby on the section. */
export function SectionHeader({ title, description, actions, as: Heading = 'h2', id, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-6 gap-y-3', className)}>
      <div className="min-w-0 space-y-0.5">
        <Heading id={id} className="text-section-title text-foreground">
          {title}
        </Heading>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
