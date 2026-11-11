import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-overline uppercase text-primary">Error 404</p>
      <h1 className="text-page-title">This page doesn’t exist</h1>
      <p className="max-w-md text-foreground-secondary">
        The address may be mistyped, or the page may have moved. Check the URL or head back to the dashboard.
      </p>
      <Button asChild className="mt-2">
        <Link to={ROUTES.dashboard}>
          <ArrowLeft /> Back to dashboard
        </Link>
      </Button>
    </div>
  )
}
