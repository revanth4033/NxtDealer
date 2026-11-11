import { X } from 'lucide-react'
import { useCallback, useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ReelPreviewDialog } from '@/features/ai-reels/components/reel-preview-dialog'
import { DashboardKpis } from '@/features/dashboard/components/dashboard-kpis'
import { InventoryOverview } from '@/features/dashboard/components/inventory-overview'
import { MarketplaceOverview } from '@/features/dashboard/components/marketplace-overview'
import { ReelsOverview } from '@/features/dashboard/components/reels-overview'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { DealerSelect } from '@/features/dealers/components/dealer-select'
import { useDealers } from '@/features/dealers/hooks/use-dealers'
import { VehicleDetailSheet } from '@/features/garage/components/vehicle-detail-sheet'
import type { AiReel, EntityId, GarageVehicle } from '@/types'

const ALL_DEALERS_PARAMS = { pageSize: 500, sortBy: 'businessName', sortDirection: 'asc' } as const

/**
 * Admin dashboard. Scope is "All dealers" or one dealer, chosen in the header.
 * Scope lives in component state, so leaving the page resets it to All dealers.
 */
export function DashboardPage() {
  const [dealerId, setDealerId] = useState<EntityId>()
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [reel, setReel] = useState<AiReel | null>(null)

  const dealers = useDealers(ALL_DEALERS_PARAMS)
  const dealer = dealers.data?.data.find((item) => item.id === dealerId)
  const summary = useDashboardSummary(dealerId)
  // While switching scope, show skeletons rather than the previous scope's numbers.
  const summaryLoading = summary.isPending || summary.isPlaceholderData

  const inspectDealer = useCallback((id: EntityId) => {
    setDealerId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const selectVehicle = useCallback((vehicle: GarageVehicle) => setVehicleId(vehicle.id), [])

  const scopeKey = dealerId ?? 'all'

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description={
          dealer
            ? `Inventory, marketplace and reel activity for ${dealer.businessName}, ${dealer.location.city}.`
            : 'Inventory, marketplace and reel activity across every NxtDealer dealer.'
        }
        actions={
          <>
            {dealer && (
              <Button variant="ghost" onClick={() => setDealerId(undefined)} className="text-foreground-secondary">
                <X /> Show all dealers
              </Button>
            )}
            <DealerSelect
              dealers={dealers.data?.data ?? []}
              value={dealerId}
              onValueChange={setDealerId}
              isLoading={dealers.isPending}
            />
          </>
        }
      />

      {summary.isError ? (
        <div className="surface">
          <EmptyState
            compact
            variant="error"
            title="Dashboard totals couldn’t be loaded"
            description="The analytics service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => summary.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : (
        <DashboardKpis summary={summary.data} dealer={dealer} isLoading={summaryLoading} />
      )}

      <MarketplaceOverview key={`marketplace-${scopeKey}`} dealer={dealer} onSelectVehicle={selectVehicle} />
      <InventoryOverview
        key={`inventory-${scopeKey}`}
        dealer={dealer}
        totals={summaryLoading ? undefined : summary.data?.totals}
        onInspectDealer={inspectDealer}
        onSelectVehicle={selectVehicle}
      />
      <ReelsOverview
        key={`reels-${scopeKey}`}
        dealer={dealer}
        totals={summaryLoading ? undefined : summary.data?.totals}
        onPlayReel={setReel}
      />

      <VehicleDetailSheet
        vehicleId={vehicleId}
        onOpenChange={(open) => !open && setVehicleId(null)}
        onPlayReel={setReel}
      />
      <ReelPreviewDialog
        reel={reel}
        onOpenChange={(open) => !open && setReel(null)}
        onViewVehicle={(id) => {
          setReel(null)
          setVehicleId(id)
        }}
      />
    </PageContainer>
  )
}
