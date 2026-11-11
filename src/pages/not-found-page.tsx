import { ArrowLeft, MapPinOff } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <EmptyState
        icon={MapPinOff}
        title="This page doesn’t exist"
        description="The address may be mistyped, or the page may have moved. Check the URL or go back to the dashboard."
        action={
          <Button asChild>
            <Link to={ROUTES.dashboard}>
              <ArrowLeft /> Back to dashboard
            </Link>
          </Button>
        }
      />
    </div>
  )
}
