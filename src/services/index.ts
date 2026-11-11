import { env, type DataSource } from '@/config/env'

import type { AppServices } from './contracts'
import { mockServices } from './mock'

/**
 * Service registry — the single swap point between mock and real data.
 *
 * To integrate the backend:
 *   1. Implement each contract in services/http/ (e.g. httpDealerService) using `request()`.
 *   2. Export `httpServices: AppServices` from services/http/index.ts.
 *   3. Return it from the "http" branch below and set VITE_DATA_SOURCE=http.
 * Pages, feature hooks and components do not change.
 */
function createServices(source: DataSource): AppServices {
  switch (source) {
    case 'mock':
      return mockServices
    case 'http':
      if (env.isDev) console.warn('[services] HTTP services are not implemented yet — falling back to mock data.')
      return mockServices
  }
}

export const services: AppServices = createServices(env.dataSource)

export type { AppServices } from './contracts'
export { ApiError, isApiError } from './errors'
export { queryKeys } from './query-keys'
