import { useId, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getRangeError, isRangeSet, parseRangeBound, type NumberRange } from '@/lib/range'
import { cn } from '@/lib/utils'

import { FilterTrigger } from './filter-dropdown'

interface RangeFilterProps {
  /** Name of the dimension, e.g. "Price". Shown on the trigger. */
  label: string
  value: NumberRange
  /** Applies a valid range. Returns `false` if it was rejected, which keeps the popover open. */
  onApply: (range: NumberRange) => boolean | void
  /** Trigger summary for an active range, e.g. "₹5 L – ₹10 L". */
  formatSummary: (range: NumberRange) => string
  minLabel?: string
  maxLabel?: string
  placeholder?: { min?: string; max?: string }
  /** Symbol shown inside the inputs, e.g. "₹". */
  prefix?: string
  /** Helper line under the inputs, e.g. the range of values available. */
  hint?: string
  /** Extra check per boundary, e.g. a four-digit year. Return an error message to reject it. */
  validateBound?: (value: number) => string | undefined
  /** Message when the minimum exceeds the maximum. */
  rangeErrorMessage?: string
  disabled?: boolean
  align?: 'start' | 'end'
  /** Classes for the trigger. */
  className?: string
}

type Errors = { min?: string; max?: string; range?: string }

const toText = (value: number | undefined) => (value === undefined ? '' : String(value))

/**
 * Toolbar filter for a numeric range: a trigger that summarises the active range and a popover with
 * labelled minimum and maximum inputs. Either side may be left blank. Validation runs on Apply and the
 * message sits under the inputs; nothing is applied until both sides are valid.
 */
export function RangeFilter({
  label,
  value,
  onApply,
  formatSummary,
  minLabel = 'Minimum',
  maxLabel = 'Maximum',
  placeholder,
  prefix,
  hint,
  validateBound,
  rangeErrorMessage,
  disabled,
  align = 'start',
  className,
}: RangeFilterProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ min: '', max: '' })
  const [errors, setErrors] = useState<Errors>({})

  const isActive = isRangeSet(value)

  const handleOpenChange = (next: boolean) => {
    // Every time it opens, start from the range that's applied, not an abandoned draft.
    if (next) {
      setDraft({ min: toText(value.min), max: toText(value.max) })
      setErrors({})
    }
    setOpen(next)
  }

  const parse = (text: string): { value?: number; error?: string } => {
    const parsed = parseRangeBound(text)
    if (parsed === 'invalid') return { error: 'Enter a whole number, or leave it blank.' }
    if (parsed !== undefined) {
      const error = validateBound?.(parsed)
      if (error) return { error }
    }
    return { value: parsed }
  }

  const apply = (range: NumberRange) => {
    if (onApply(range) === false) return
    setOpen(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const min = parse(draft.min)
    const max = parse(draft.max)
    const range = { min: min.value, max: max.value }
    const next: Errors = {
      min: min.error,
      max: max.error,
      range: min.error || max.error ? undefined : getRangeError(range) && (rangeErrorMessage ?? getRangeError(range)),
    }
    setErrors(next)
    if (next.min || next.max || next.range) return
    apply(range)
  }

  const errorText = errors.range ?? [errors.min && `${minLabel}: ${errors.min}`, errors.max && `${maxLabel}: ${errors.max}`].filter(Boolean).join(' ')
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  // The error replaces the hint while it's shown, so only one of them describes the inputs.
  const describedBy = errorText ? errorId : hint ? hintId : undefined

  const field = (side: 'min' | 'max', fieldLabel: string) => {
    const invalid = Boolean(errors[side] || errors.range)
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label htmlFor={`${id}-${side}`} className="text-caption font-medium text-foreground-secondary">
          {fieldLabel}
        </label>
        <div className="relative">
          {prefix && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              {prefix}
            </span>
          )}
          <Input
            id={`${id}-${side}`}
            inputMode="numeric"
            autoComplete="off"
            value={draft[side]}
            placeholder={placeholder?.[side] ?? 'Any'}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setDraft((current) => ({ ...current, [side]: event.target.value }))
              // An edited field is no longer the one in error.
              if (errors[side] || errors.range) setErrors((current) => ({ ...current, [side]: undefined, range: undefined }))
            }}
            className={cn('tabular-nums max-sm:h-11', prefix && 'pl-7')}
          />
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <FilterTrigger
          label={label}
          summary={isActive ? formatSummary(value) : undefined}
          disabled={disabled}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align={align} className="w-80 max-w-[calc(100vw-2rem)] gap-0 p-0">
        <form onSubmit={handleSubmit} noValidate aria-label={`Filter by ${label.toLowerCase()}`}>
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm font-medium text-foreground">Filter by {label.toLowerCase()}</p>
            <div className="flex items-start gap-3">
              {field('min', minLabel)}
              <span aria-hidden className="mt-8 text-muted-foreground">
                –
              </span>
              {field('max', maxLabel)}
            </div>
            {errorText ? (
              <p id={errorId} role="alert" className="text-caption text-destructive">
                {errorText}
              </p>
            ) : (
              hint && (
                <p id={hintId} className="text-caption text-muted-foreground">
                  {hint}
                </p>
              )
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-foreground-secondary max-sm:h-11 max-sm:px-4"
              disabled={!isActive && !draft.min && !draft.max}
              onClick={() => apply({})}
            >
              Clear
            </Button>
            <Button type="submit" size="sm" className="max-sm:h-11 max-sm:px-5">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
