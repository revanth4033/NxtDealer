import { useCallback, useEffect, useRef, useState } from 'react'

/** Copies text and exposes a short-lived confirmation message for an aria-live region. */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string, confirmation = 'Copied to clipboard') => {
      window.clearTimeout(timer.current)
      try {
        await navigator.clipboard.writeText(text)
        setMessage(confirmation)
      } catch {
        setMessage('Couldn’t copy — your browser blocked clipboard access')
      }
      timer.current = window.setTimeout(() => setMessage(null), resetAfterMs)
    },
    [resetAfterMs],
  )

  return { copy, message }
}
