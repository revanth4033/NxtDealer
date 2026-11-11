import { env } from '@/config/env'
import { cn } from '@/lib/utils'

/** Small pill showing which data source the portal is running against. */
export function DataSourceIndicator({ className }: { className?: string }) {
  const isMock = env.dataSource === 'mock'

  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full border bg-card px-2.5 text-caption font-medium text-foreground-secondary',
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', isMock ? 'bg-warning' : 'bg-success')} />
      {isMock ? 'Mock data' : 'Live API'}
    </span>
  )
}
