import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Vertical rhythm for a page: header → content sections.
 * 32px between the header block and content, 32px between sections on desktop.
 */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-6 lg:gap-8', className)}>{children}</div>
}

/** A titled content block within a page. Pair with SectionHeader. */
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
    <section aria-labelledby={labelledBy} className={cn('flex flex-col gap-4', className)}>
      {children}
    </section>
  )
}
