import { Download, Plus, RefreshCw } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { FilterDropdown } from '@/components/common/filter-dropdown'
import { SearchInput } from '@/components/common/search-input'
import { SectionHeader } from '@/components/common/section-header'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AI_REEL_STATUS, LISTING_STATUS, toOptions } from '@/config/status'
import type { AiReelStatus, ListingStatus } from '@/types'

/** Interactive input components. Each demo reflects its current value so behaviour is verifiable. */
export function InputsSection() {
  return (
    <div className="flex flex-col gap-10">
      <ButtonsDemo />
      <SearchAndFiltersDemo />
      <TabsDemo />
    </div>
  )
}

function DemoSurface({ children }: { children: ReactNode }) {
  return <div className="surface p-5">{children}</div>
}

function ValueReadout({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-caption text-muted-foreground">
      {label}: <span className="font-medium text-foreground tabular-nums">{value}</span>
    </p>
  )
}

function ButtonsDemo() {
  const [clicks, setClicks] = useState(0)

  return (
    <PageSection labelledBy="kit-buttons">
      <SectionHeader
        id="kit-buttons"
        title="Buttons"
        description="One primary action per view. Outline and ghost for secondary actions; destructive only for irreversible ones."
      />
      <DemoSurface>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setClicks((n) => n + 1)}>
              <Plus /> Primary
            </Button>
            <Button variant="outline" onClick={() => setClicks((n) => n + 1)}>
              <Download /> Outline
            </Button>
            <Button variant="secondary" onClick={() => setClicks((n) => n + 1)}>
              Secondary
            </Button>
            <Button variant="ghost" onClick={() => setClicks((n) => n + 1)}>
              <RefreshCw /> Ghost
            </Button>
            <Button variant="destructive" onClick={() => setClicks((n) => n + 1)}>
              Destructive
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => setClicks((n) => n + 1)}>
              Small
            </Button>
            <Button size="lg" onClick={() => setClicks((n) => n + 1)}>
              Large
            </Button>
            <Button size="icon" variant="outline" aria-label="Refresh" onClick={() => setClicks((n) => n + 1)}>
              <RefreshCw />
            </Button>
          </div>
          <ValueReadout label="Button presses" value={String(clicks)} />
        </div>
      </DemoSurface>
    </PageSection>
  )
}

function SearchAndFiltersDemo() {
  const [query, setQuery] = useState('')
  const [statuses, setStatuses] = useState<ListingStatus[]>(['live'])
  const [reelStatus, setReelStatus] = useState<AiReelStatus | undefined>()

  return (
    <PageSection labelledBy="kit-filters">
      <SectionHeader
        id="kit-filters"
        title="Search and filters"
        description="Search commits after 300 ms of inactivity; Escape clears. Filters support multi- and single-select."
      />
      <DemoSurface>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={query} onValueChange={setQuery} placeholder="Search listings" />
            <FilterDropdown
              mode="multiple"
              label="Listing status"
              options={toOptions(LISTING_STATUS)}
              value={statuses}
              onValueChange={setStatuses}
            />
            <FilterDropdown
              mode="single"
              label="Reel status"
              options={toOptions(AI_REEL_STATUS)}
              value={reelStatus}
              onValueChange={setReelStatus}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <ValueReadout label="Committed search" value={query ? `“${query}”` : 'none'} />
            <ValueReadout label="Listing status" value={statuses.length ? statuses.join(', ') : 'any'} />
            <ValueReadout label="Reel status" value={reelStatus ?? 'any'} />
          </div>
        </div>
      </DemoSurface>
    </PageSection>
  )
}

function TabsDemo() {
  const [range, setRange] = useState('30d')

  return (
    <PageSection labelledBy="kit-tabs">
      <SectionHeader
        id="kit-tabs"
        title="Tabs"
        description="Line tabs switch page-level views (see this page’s header). Segment tabs switch views inside a section."
        actions={
          <Tabs value={range} onValueChange={setRange}>
            <TabsList variant="segment" aria-label="Time range">
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
              <TabsTrigger value="90d">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      <DemoSurface>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Dealer detail views">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reels">AI reels</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ValueReadout label="Showing" value={`Overview, last ${range.replace('d', ' days')}`} />
          </TabsContent>
          <TabsContent value="listings">
            <ValueReadout label="Showing" value={`Listings, last ${range.replace('d', ' days')}`} />
          </TabsContent>
          <TabsContent value="reels">
            <ValueReadout label="Showing" value={`AI reels, last ${range.replace('d', ' days')}`} />
          </TabsContent>
        </Tabs>
      </DemoSurface>
    </PageSection>
  )
}
