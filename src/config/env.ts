/**
 * Typed access to build-time environment variables.
 * Only variables prefixed with VITE_ are exposed to the client by Vite.
 */

export type DataSource = 'mock' | 'http'

function readDataSource(value: string | undefined): DataSource {
  return value === 'http' ? 'http' : 'mock'
}

export const env = {
  /** Which service implementation the app should use. Defaults to "mock". */
  dataSource: readDataSource(import.meta.env.VITE_DATA_SOURCE),
  /** Base URL for the future REST API, e.g. https://api.nxtdealer.in/admin/v1 */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  /** Artificial latency applied by mock services, in milliseconds. */
  mockLatencyMs: Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 350),
  isDev: import.meta.env.DEV,
} as const
