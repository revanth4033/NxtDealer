import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

type ParamValue = string | number | string[] | null | undefined

/**
 * Reads and writes view state (search, filters, tabs, page, sort) in the URL query string,
 * so every view is linkable and survives reloads and back/forward navigation.
 */
export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback((key: string) => searchParams.get(key) ?? undefined, [searchParams])
  const getAll = useCallback((key: string) => searchParams.getAll(key), [searchParams])
  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const parsed = Number(searchParams.get(key))
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    },
    [searchParams],
  )

  /**
   * Patch one or more params. `null`/`undefined`/`""`/`[]` remove the key.
   * Uses history replace by default so typing in a search box doesn't flood the back stack.
   */
  const update = useCallback(
    (patch: Record<string, ParamValue>, options: { replace?: boolean } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          for (const [key, value] of Object.entries(patch)) {
            next.delete(key)
            if (value === null || value === undefined || value === '') continue
            if (Array.isArray(value)) value.forEach((item) => next.append(key, item))
            else next.set(key, String(value))
          }
          return next
        },
        { replace: options.replace ?? true, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  return useMemo(() => ({ searchParams, get, getAll, getNumber, update }), [searchParams, get, getAll, getNumber, update])
}
