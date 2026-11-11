import { env } from '@/config/env'
import { ApiError } from '@/services/errors'
import type { ApiErrorShape } from '@/types'

type QueryValue = string | number | boolean | undefined | null

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
  headers?: Record<string, string>
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  if (!env.apiBaseUrl) {
    throw new ApiError({ status: 0, code: 'config_error', message: 'VITE_API_BASE_URL is not configured.' })
  }
  const url = new URL(path.replace(/^\//, ''), env.apiBaseUrl.replace(/\/?$/, '/'))
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/**
 * Minimal typed fetch wrapper for future HTTP service implementations.
 * Not used while VITE_DATA_SOURCE=mock. Auth headers will be injected here
 * once an authentication strategy is defined.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal, headers } = options

  const url = buildUrl(path, query)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError({ status: 0, code: 'network_error', message: 'Unable to reach the server.' })
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as Partial<ApiErrorShape> | null
    throw new ApiError({
      status: response.status,
      code: payload?.code ?? 'http_error',
      message: payload?.message ?? response.statusText,
    })
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
