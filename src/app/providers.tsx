import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, type ReactNode } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { queryClient } from './query-client'

// Loaded only in development so the devtools never reach the production bundle.
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : () => null

/** Global providers. Add new app-wide context (theme, auth, toasts) here. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Suspense fallback={null}>
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  )
}
