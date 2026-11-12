import { ArrowDownUp, ChevronDown, LayoutGrid, Rows3, X } from 'lucide-react'

import { FilterDropdown, type FilterOption } from '@/components/common/filter-dropdown'
import { RangeFilter } from '@/components/common/range-filter'
import { SearchInput } from '@/components/common/search-input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/features/garage/vehicle-labels'
import { formatNumber, formatPriceShort } from '@/lib/format'
import type { NumberRange } from '@/lib/range'
import { cn } from '@/lib/utils'
import type { FacetCount, MarketplaceFacets } from '@/types'

import type { MarketplaceSort, MarketplaceView, useMarketplaceState } from '../hooks/use-marketplace-state'

type MarketplaceState = ReturnType<typeof useMarketplaceState>

const SORT_OPTIONS: { value: string; label: string; sort: MarketplaceSort }[] = [
  { value: 'publishedAt:desc', label: 'Newest published', sort: { field: 'publishedAt', direction: 'desc' } },
  { value: 'publishedAt:asc', label: 'Oldest published', sort: { field: 'publishedAt', direction: 'asc' } },
  { value: 'price:asc', label: 'Price: low to high', sort: { field: 'price', direction: 'asc' } },
  { value: 'price:desc', label: 'Price: high to low', sort: { field: 'price', direction: 'desc' } },
  { value: 'year:desc', label: 'Year: newest first', sort: { field: 'year', direction: 'desc' } },
  { value: 'year:asc', label: 'Year: oldest first', sort: { field: 'year', direction: 'asc' } },
]

/**
 * Faceted options. A count of 0 means choosing it alongside the other active filters would show
 * nothing, so it's disabled — unless it's already selected, so it can always be removed.
 */
function toOptions<T extends string>(facets: FacetCount<T>[], label: (value: T) => string = String): FilterOption<T>[] {
  return facets.map(({ value, count }) => ({ value, label: label(value), count, disabled: count === 0 }))
}

/** Models follow the make filter: only the chosen makes' models are offered, grouped by make. */
function modelOptions(facets: MarketplaceFacets['models'], makes: string[], models: string[]): FilterOption[] {
  return facets
    .filter((option) => !makes.length || makes.includes(option.make) || models.includes(option.value))
    .map(({ value, count, make }) => ({ value, label: value, count, group: make, disabled: count === 0 }))
}

const summariseRange = (format: (value: number) => string) => ({ min, max }: NumberRange) =>
  min !== undefined && max !== undefined
    ? min === max
      ? format(min)
      : `${format(min)}–${format(max)}`
    : min !== undefined
      ? `From ${format(min)}`
      : `Up to ${format(max!)}`

/*
 * Phones get 44px touch targets on every toolbar control and menu item; from `sm` up the toolbar keeps
 * the portal's standard 36px controls.
 */
const TOUCH = 'max-sm:h-11'
const TOUCH_MENU = 'max-sm:[&_[role^=menuitem]]:min-h-11'

const formatRupees = (amount: number) => formatPriceShort({ amount, currency: 'INR' })
const validateYear = (year: number) => (year < 1900 || year > 2100 ? 'Enter a four-digit year.' : undefined)

interface MarketplaceToolbarProps {
  state: MarketplaceState
  facets: MarketplaceFacets | undefined
}

/** Search, sort, view switch and every directory filter. Shared by the table and grid views. */
export function MarketplaceToolbar({ state, facets }: MarketplaceToolbarProps) {
  const loading = !facets
  const makeOfModel = new Map(facets?.models.map((option) => [option.value, option.make]))
  const bounds = facets?.bounds ?? undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={state.search}
          onValueChange={state.setSearch}
          placeholder="Search vehicle, dealer or city"
          label="Search listings by make, model, variant, dealer, city or colour"
          className="sm:w-80 max-sm:[&_input]:h-11"
        />
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <SortMenu sort={state.sort} onSortChange={state.setSort} />
          <Tabs value={state.view} onValueChange={(next) => state.setView(next as MarketplaceView)}>
            <TabsList variant="segment" aria-label="Listing view" className={TOUCH}>
              <TabsTrigger value="table" aria-label="Table view">
                <Rows3 aria-hidden />
                <span className="hidden sm:inline">Table</span>
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Grid view">
                <LayoutGrid aria-hidden />
                <span className="hidden sm:inline">Grid</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="Dealer"
          disabled={loading}
          options={facets ? facets.dealers.map(({ value, name, count }) => ({ value, label: name, count, disabled: count === 0 })) : []}
          value={state.dealerIds}
          onValueChange={state.setDealerIds}
        />
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="City"
          disabled={loading}
          options={toOptions(facets?.cities ?? [])}
          value={state.cities}
          onValueChange={state.setCities}
        />
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="Make"
          disabled={loading}
          options={toOptions(facets?.makes ?? [])}
          value={state.makes}
          onValueChange={(next) => state.setMakes(next, (model) => makeOfModel.get(model))}
        />
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="Model"
          disabled={loading}
          options={modelOptions(facets?.models ?? [], state.makes, state.models)}
          value={state.models}
          onValueChange={state.setModels}
        />
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="Fuel"
          disabled={loading}
          options={toOptions(facets?.fuelTypes ?? [], (value) => FUEL_LABELS[value])}
          value={state.fuelTypes}
          onValueChange={state.setFuelTypes}
        />
        <FilterDropdown
          mode="multiple"
          className={TOUCH}
          contentClassName={TOUCH_MENU}
          label="Transmission"
          disabled={loading}
          options={toOptions(facets?.transmissions ?? [], (value) => TRANSMISSION_LABELS[value])}
          value={state.transmissions}
          onValueChange={state.setTransmissions}
        />
        <RangeFilter
          className={TOUCH}
          label="Year"
          minLabel="From"
          maxLabel="To"
          disabled={loading}
          value={state.year}
          onApply={state.setYearRange}
          formatSummary={summariseRange(String)}
          placeholder={bounds && { min: String(bounds.year.min), max: String(bounds.year.max) }}
          hint={bounds && `Listed vehicles are from ${bounds.year.min} to ${bounds.year.max}.`}
          validateBound={validateYear}
          rangeErrorMessage="“From” can’t be a later year than “To”."
        />
        <RangeFilter
          className={TOUCH}
          label="Price"
          disabled={loading}
          value={state.price}
          onApply={state.setPriceRange}
          formatSummary={summariseRange(formatRupees)}
          prefix="₹"
          placeholder={bounds && { min: formatNumber(bounds.price.min), max: formatNumber(bounds.price.max) }}
          hint={bounds && `In rupees. Listings range from ${formatRupees(bounds.price.min)} to ${formatRupees(bounds.price.max)}.`}
          rangeErrorMessage="The minimum price can’t be more than the maximum."
        />
        {state.hasFilters && (
          <Button variant="ghost" onClick={state.clearFilters} className={cn('text-foreground-secondary', TOUCH)}>
            <X /> Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}

function SortMenu({ sort, onSortChange }: { sort: MarketplaceSort; onSortChange: (sort: MarketplaceSort) => void }) {
  const current = SORT_OPTIONS.find((option) => option.sort.field === sort.field && option.sort.direction === sort.direction) ?? SORT_OPTIONS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn('gap-1.5 font-medium', TOUCH)} aria-label={`Sort: ${current.label}`}>
          <ArrowDownUp aria-hidden className="text-muted-foreground" />
          {current.label}
          <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn('w-52', TOUCH_MENU)}>
        <DropdownMenuLabel>Sort listings</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={current.value}
          onValueChange={(next) => {
            const option = SORT_OPTIONS.find((item) => item.value === next)
            if (option) onSortChange(option.sort)
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
