import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: { root: 'size-6 rounded-md after:rounded-md', fallback: 'rounded-md text-[10px]' },
  md: { root: 'size-8 rounded-lg after:rounded-lg', fallback: 'rounded-lg text-caption' },
  lg: { root: 'size-14 rounded-xl after:rounded-xl', fallback: 'rounded-xl text-lg' },
} as const

/** Square initials avatar for organisations such as dealers. */
export function EntityAvatar({ name, size = 'md', className }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  return (
    <Avatar className={cn(SIZES[size].root, className)}>
      <AvatarFallback className={cn('bg-muted font-semibold text-foreground-secondary', SIZES[size].fallback)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
