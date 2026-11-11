import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react'
import { Link } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { useCurrentAdmin } from '@/hooks/use-current-admin'
import { getInitials } from '@/lib/format'
import type { AdminRole } from '@/types'

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super admin',
  operations: 'Operations',
  support: 'Support',
  viewer: 'Viewer',
}

export function UserMenu() {
  const { data: admin, isPending } = useCurrentAdmin()

  if (isPending || !admin) {
    return <Skeleton className="h-9 w-36 rounded-lg" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[state=open]:bg-muted">
        <Avatar className="size-8">
          {admin.avatarUrl && <AvatarImage src={admin.avatarUrl} alt="" />}
          <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
            {getInitials(admin.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-medium text-foreground">{admin.name}</span>
          <span className="text-caption text-muted-foreground">{ROLE_LABELS[admin.role]}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{admin.name}</span>
          <span className="text-caption font-normal text-muted-foreground">{admin.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserRound /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.settings}>
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
