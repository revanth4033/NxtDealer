import { ChevronDown, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface FilterOption<T extends string = string> {
  value: T
  label: string
  /** Optional result count shown alongside the option. */
  count?: number
}

interface BaseProps<T extends string> {
  /** Name of the dimension, e.g. "Plan". Shown on the trigger. */
  label: string
  options: FilterOption<T>[]
  align?: 'start' | 'end'
  className?: string
}

interface MultiSelectProps<T extends string> extends BaseProps<T> {
  mode: 'multiple'
  value: T[]
  onValueChange: (value: T[]) => void
}

interface SingleSelectProps<T extends string> extends BaseProps<T> {
  mode: 'single'
  value: T | undefined
  onValueChange: (value: T | undefined) => void
}

export type FilterDropdownProps<T extends string> = MultiSelectProps<T> | SingleSelectProps<T>

/** Dropdown filter for one dimension. The trigger summarises the active selection. */
export function FilterDropdown<T extends string>(props: FilterDropdownProps<T>) {
  const { label, options, align = 'start', className } = props
  const selected: T[] = props.mode === 'multiple' ? props.value : props.value ? [props.value] : []
  const isActive = selected.length > 0

  const summary =
    selected.length === 1
      ? options.find((option) => option.value === selected[0])?.label
      : selected.length > 1
        ? `${selected.length} selected`
        : undefined

  const clear = () => (props.mode === 'multiple' ? props.onValueChange([]) : props.onValueChange(undefined))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('gap-1.5 font-medium', isActive && 'border-primary/30 bg-accent/40 hover:bg-accent/70', className)}
        >
          <span className={cn(isActive ? 'text-foreground-secondary' : 'text-foreground')}>{label}</span>
          {summary && (
            <>
              <span aria-hidden className="h-4 w-px bg-border" />
              <span className="max-w-32 truncate text-accent-foreground">{summary}</span>
            </>
          )}
          <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel>Filter by {label.toLowerCase()}</DropdownMenuLabel>
        {props.mode === 'multiple' ? (
          <DropdownMenuGroup>
            {options.map((option) => {
              const checked = props.value.includes(option.value)
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={checked}
                  // Keep the menu open so several options can be toggled in one go.
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(next) =>
                    props.onValueChange(
                      next ? [...props.value, option.value] : props.value.filter((value) => value !== option.value),
                    )
                  }
                >
                  <OptionLabel option={option} />
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuRadioGroup
            value={props.value ?? ''}
            onValueChange={(next) => props.onValueChange(next ? (next as T) : undefined)}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <OptionLabel option={option} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}

        {isActive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={clear}>
              <X aria-hidden />
              Clear filter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OptionLabel({ option }: { option: FilterOption }) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span>{option.label}</span>
      {option.count !== undefined && (
        <span className="text-caption text-muted-foreground tabular-nums">{option.count}</span>
      )}
    </span>
  )
}
