import { ChevronDown, X } from 'lucide-react'
import { Fragment, type ComponentProps } from 'react'

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
  /** Options sharing a group are listed together under that heading, in first-seen order. */
  group?: string
  /** Shown but not selectable, e.g. an option no result matches. Selected options stay selectable. */
  disabled?: boolean
}

interface BaseProps<T extends string> {
  /** Name of the dimension, e.g. "Plan". Shown on the trigger. */
  label: string
  options: FilterOption<T>[]
  align?: 'start' | 'end'
  /** Disables the trigger, e.g. while options load. */
  disabled?: boolean
  /** Classes for the trigger. */
  className?: string
  /** Classes for the menu, e.g. larger touch targets on small screens. */
  contentClassName?: string
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

interface FilterTriggerProps extends ComponentProps<typeof Button> {
  label: string
  /** Short description of the active selection. Its presence marks the filter as active. */
  summary?: string
}

/** Trigger button shared by every toolbar filter, so active filters look the same whatever their kind. */
export function FilterTrigger({ label, summary, className, ...props }: FilterTriggerProps) {
  const isActive = Boolean(summary)
  return (
    <Button
      variant="outline"
      className={cn('gap-1.5 font-medium', isActive && 'border-primary/30 bg-accent/40 hover:bg-accent/70', className)}
      {...props}
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
  )
}

/** Splits options into consecutive heading groups; ungrouped options form one unnamed group. */
function groupOptions<T extends string>(options: FilterOption<T>[]) {
  const groups = new Map<string | undefined, FilterOption<T>[]>()
  for (const option of options) groups.set(option.group, [...(groups.get(option.group) ?? []), option])
  return [...groups]
}

/** Dropdown filter for one dimension. The trigger summarises the active selection. */
export function FilterDropdown<T extends string>(props: FilterDropdownProps<T>) {
  const { label, options, align = 'start', disabled, className, contentClassName } = props
  const selected: T[] = props.mode === 'multiple' ? props.value : props.value ? [props.value] : []
  const isActive = selected.length > 0

  const summary =
    selected.length === 1
      ? (options.find((option) => option.value === selected[0])?.label ?? '1 selected')
      : selected.length > 1
        ? `${selected.length} selected`
        : undefined

  const clear = () => (props.mode === 'multiple' ? props.onValueChange([]) : props.onValueChange(undefined))
  const isDisabled = (option: FilterOption<T>) => Boolean(option.disabled) && !selected.includes(option.value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterTrigger label={label} summary={summary} disabled={disabled} className={className} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={cn('w-56', contentClassName)}>
        <DropdownMenuLabel>Filter by {label.toLowerCase()}</DropdownMenuLabel>
        {props.mode === 'multiple' ? (
          groupOptions(options).map(([group, items], index) => (
            <Fragment key={group ?? `group-${index}`}>
              {group && (
                <DropdownMenuLabel className={cn('pb-0.5 text-caption font-medium text-muted-foreground', index > 0 && 'pt-2.5')}>
                  {group}
                </DropdownMenuLabel>
              )}
              <DropdownMenuGroup>
                {items.map((option) => {
                  const checked = props.value.includes(option.value)
                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={checked}
                      disabled={isDisabled(option)}
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
            </Fragment>
          ))
        ) : (
          <DropdownMenuRadioGroup
            value={props.value ?? ''}
            onValueChange={(next) => props.onValueChange(next ? (next as T) : undefined)}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} disabled={isDisabled(option)}>
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
