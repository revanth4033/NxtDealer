import { QueryClient } from '@tanstack/react-query'

import { isApiError } from '@/services'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Don't retry client errors (4xx) — they won't succeed on a second attempt.
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < MAX_RETRIES
      },
    },
  },
})
