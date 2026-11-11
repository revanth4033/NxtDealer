import type { ApiErrorShape } from '@/types'

/**
 * The only error type services are allowed to throw.
 * Mock and HTTP implementations both normalise failures into ApiError,
 * so UI code can handle errors identically regardless of data source.
 */
export class ApiError extends Error implements ApiErrorShape {
  readonly status: number
  readonly code: string

  constructor({ status, code, message }: ApiErrorShape) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  static notFound(entity: string, id: string): ApiError {
    return new ApiError({ status: 404, code: 'not_found', message: `${entity} "${id}" was not found.` })
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
