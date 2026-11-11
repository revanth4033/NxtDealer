import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { useCurrentAdmin } from '@/hooks/use-current-admin'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AdminRole, AdminUser } from '@/types'

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super admin',
  operations: 'Operations',
  support: 'Support',
  viewer: 'Viewer',
}

interface UserMenuProps {
  /**
   * sidebar: full-width profile block (avatar, name, role) at the bottom of the sidebar.
   * topbar:  compact avatar button.
   */
  variant: 'sidebar' | 'topbar'
  className?: string
}

/** Admin profile trigger + account menu. Both variants share one menu so options never drift apart. */
export function UserMenu({ variant, className }: UserMenuProps) {
  const { data: admin, isPending } = useCurrentAdmin()

  if (isPending || !admin) {
    return variant === 'sidebar' ? (
      <div className={cn('flex items-center gap-3 p-2', className)}>
        <Skeleton className="size-8 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ) : (
      <Skeleton className={cn('size-8 rounded-full', className)} />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${admin.name}`}
        className={cn(
          'cursor-pointer outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/30',
          variant === 'sidebar'
            ? 'flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted data-[state=open]:bg-muted'
            : 'rounded-full ring-offset-2 ring-offset-card hover:ring-2 hover:ring-border data-[state=open]:ring-2 data-[state=open]:ring-border',
          className,
        )}
      >
        <AdminAvatar admin={admin} />
        {variant === 'sidebar' && (
          <>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{admin.name}</span>
              <span className="truncate text-caption text-muted-foreground">{ROLE_LABELS[admin.role]}</span>
            </span>
            <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={variant === 'sidebar' ? 'top' : 'bottom'}
        align={variant === 'sidebar' ? 'start' : 'end'}
        sideOffset={8}
        className="w-60"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
          <AdminAvatar admin={admin} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">{admin.name}</span>
            <span className="truncate text-caption font-normal text-muted-foreground">{admin.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.settings}>
              <Settings /> Account settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Authentication isn't connected yet, so sign-out is shown disabled with the reason rather than doing nothing. */}
        <DropdownMenuItem disabled className="items-start">
          <LogOut className="mt-0.5" />
          <span className="flex flex-col">
            <span>Sign out</span>
            <span className="text-caption text-muted-foreground">Available once sign-in is connected</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AdminAvatar({ admin }: { admin: AdminUser }) {
  return (
    <Avatar className="size-8 shrink-0">
      {admin.avatarUrl && <AvatarImage src={admin.avatarUrl} alt="" />}
      <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
        {getInitials(admin.name)}
      </AvatarFallback>
    </Avatar>
  )
}
