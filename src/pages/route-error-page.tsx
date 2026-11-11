import { AlertTriangle, RotateCcw } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { BrandMark } from '@/components/common/brand-mark'
import { Button } from '@/components/ui/button'
import { env } from '@/config/env'

/** Top-level error boundary for unexpected render or routing failures. */
export function RouteErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <BrandMark />
        <span className="mt-4 grid size-11 place-items-center rounded-full bg-danger-soft text-destructive">
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="text-page-title">Something went wrong</h1>
        <p className="text-foreground-secondary">
          The portal hit an unexpected error. Reloading usually fixes it; if not, contact the platform team.
        </p>
        {env.isDev && (
          <pre className="w-full overflow-x-auto rounded-md border bg-card p-3 text-left text-caption text-destructive">
            {message}
          </pre>
        )}
        <Button onClick={() => window.location.reload()}>
          <RotateCcw /> Reload portal
        </Button>
      </div>
    </div>
  )
}
