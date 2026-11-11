import { Search, X } from 'lucide-react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  /** Called after the user stops typing for `debounceMs`, and immediately on clear. */
  onValueChange: (value: string) => void
  placeholder?: string
  /** Accessible name. Defaults to the placeholder. */
  label?: string
  debounceMs?: number
  className?: string
}

/**
 * Debounced search field with a clear button. Escape clears the query.
 * Controlled: `value` is the committed query (e.g. from the URL); typing is buffered locally.
 */
export function SearchInput({
  value,
  onValueChange,
  placeholder = 'Search…',
  label,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(value)
  // The last value this input committed. Lets us tell our own commits apart from external changes.
  const [committed, setCommitted] = useState(value)

  // Adopt external changes (e.g. "Clear filters") without an effect, never overwriting in-flight typing.
  if (value !== committed) {
    setCommitted(value)
    setDraft(value)
  }

  const commitValue = (next: string) => {
    setCommitted(next)
    onValueChange(next)
  }
  // Effect Events must only be called from effects; event handlers use commitValue directly.
  const commitFromEffect = useEffectEvent(commitValue)

  useEffect(() => {
    const next = draft.trim()
    if (next === committed) return
    const timer = window.setTimeout(() => commitFromEffect(next), debounceMs)
    return () => window.clearTimeout(timer)
  }, [draft, committed, debounceMs])

  const clear = () => {
    setDraft('')
    if (committed !== '') commitValue('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full sm:w-72', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && draft) {
            event.preventDefault()
            clear()
          }
        }}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
