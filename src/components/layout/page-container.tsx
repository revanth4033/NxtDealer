import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Vertical rhythm for a page: header → content sections, `gap-section` (24px) apart at every width.
 * Pages never add their own section spacing; change `--layout-section-gap` instead.
 */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-section', className)}>{children}</div>
}

/** A titled content block within a page. Pair with SectionHeader; its content sits `gap-section` below the heading. */
export function PageSection({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  /** id of the SectionHeader heading, for an accessible region name. */
  labelledBy?: string
}) {
  return (
    <section aria-labelledby={labelledBy} className={cn('flex flex-col gap-section', className)}>
      {children}
    </section>
  )
}
