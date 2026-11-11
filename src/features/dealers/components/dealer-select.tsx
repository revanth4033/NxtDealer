import { ChevronsUpDown, LayoutGrid } from 'lucide-react'
import { useState } from 'react'

import { EntityAvatar } from '@/components/common/entity-avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DEALER_STATUS } from '@/config/status'
import { cn } from '@/lib/utils'
import type { Dealer, EntityId } from '@/types'

interface DealerSelectProps {
  dealers: Dealer[]
  /** `undefined` means "All dealers". */
  value: EntityId | undefined
  onValueChange: (dealerId: EntityId | undefined) => void
  isLoading?: boolean
  className?: string
}

const ALL_DEALERS = '__all__'

/** Plain substring match on name, owner and city. cmdk's default fuzzy scoring matches too loosely for names. */
function matchDealer(_value: string, search: string, keywords: string[] = []) {
  const query = search.trim().toLowerCase()
  if (!query) return 1
  return keywords.some((keyword) => keyword.toLowerCase().includes(query)) ? 1 : 0
}

/** Searchable dealer picker with "All dealers" as the first option. */
export function DealerSelect({ dealers, value, onValueChange, isLoading = false, className }: DealerSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = dealers.find((dealer) => dealer.id === value)

  const choose = (dealerId: EntityId | undefined) => {
    onValueChange(dealerId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={`Dashboard scope: ${selected ? selected.businessName : 'All dealers'}`}
          disabled={isLoading && !selected}
          className={cn('h-10 w-full justify-between gap-2.5 px-3 sm:w-72', className)}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {selected ? (
              <EntityAvatar name={selected.businessName} size="sm" />
            ) : (
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent text-primary">
                <LayoutGrid aria-hidden className="size-3.5" />
              </span>
            )}
            <span className="truncate font-medium">{selected ? selected.businessName : 'All dealers'}</span>
          </span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-(--radix-popover-trigger-width) min-w-72 p-0">
        <Command filter={matchDealer}>
          <CommandInput placeholder="Search by dealer, owner or city" />
          <CommandList className="max-h-80">
            <CommandEmpty>No dealers match that search.</CommandEmpty>
            <CommandGroup>
              <CommandItem value={ALL_DEALERS} keywords={['all dealers', 'platform']} data-checked={!selected} onSelect={() => choose(undefined)}>
                <LayoutGrid aria-hidden className="text-muted-foreground" />
                <span className="font-medium">All dealers</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={`Dealers (${dealers.length})`}>
              {dealers.map((dealer) => (
                <CommandItem
                  key={dealer.id}
                  value={dealer.id}
                  keywords={[dealer.businessName, dealer.ownerName, dealer.location.city]}
                  data-checked={dealer.id === value}
                  onSelect={() => choose(dealer.id)}
                  className="items-start"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-foreground">{dealer.businessName}</span>
                    <span className="truncate text-caption text-muted-foreground">
                      {dealer.location.city}
                      {dealer.status !== 'active' && `, ${DEALER_STATUS[dealer.status].label.toLowerCase()}`}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
