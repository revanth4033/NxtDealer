import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import type { RoutePath } from '@/config/routes'

/** "Go to the full page" link for a section header. */
export function SectionLink({ to, children }: { to: RoutePath; children: string }) {
  return (
    <Button variant="ghost" size="sm" asChild className="-mr-2 text-foreground-secondary">
      <Link to={to}>
        {children}
        <ChevronRight aria-hidden data-icon="inline-end" />
      </Link>
    </Button>
  )
}
