import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Vertical rhythm wrapper for page content. Every page renders inside one. */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-6 lg:gap-8', className)}>{children}</div>
}
