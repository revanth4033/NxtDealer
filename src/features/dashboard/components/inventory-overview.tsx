import { SectionHeader } from '@/components/common/section-header'
import { SectionLink } from '@/components/common/section-link'
import { PageSection } from '@/components/layout/page-container'
import { ROUTES } from '@/config/routes'
import { DealerGarageTable } from '@/features/garage/components/dealer-garage-table'
import type { Dealer, EntityId, GarageVehicle, InventoryTotals } from '@/types'

import { DealerInventoryTable } from './dealer-inventory-table'

interface InventoryOverviewProps {
  dealer: Dealer | undefined
  totals: InventoryTotals | undefined
  onInspectDealer: (dealerId: EntityId) => void
  onSelectVehicle: (vehicle: GarageVehicle) => void
}

/** Garage inventory: dealer-wise summary for the platform, or one dealer's full garage. */
export function InventoryOverview({ dealer, totals, onInspectDealer, onSelectVehicle }: InventoryOverviewProps) {
  return (
    <PageSection labelledBy="dashboard-inventory">
      <SectionHeader
        id="dashboard-inventory"
        title={dealer ? 'Garage inventory' : 'Dealer inventory'}
        description={
          dealer
            ? `Every vehicle in ${dealer.businessName}’s garage. Published vehicles are also listed on the marketplace.`
            : 'Garage size and marketplace share for each dealer. Published vehicles are counted within the garage.'
        }
        actions={<SectionLink to={ROUTES.dealers}>Open dealers</SectionLink>}
      />
      {dealer ? (
        <DealerGarageTable dealer={dealer} totals={totals} onSelectVehicle={onSelectVehicle} />
      ) : (
        <DealerInventoryTable onInspectDealer={onInspectDealer} />
      )}
    </PageSection>
  )
}
