import type { Dealer } from '@/types'

/** Hand-written dealers that other fixtures (listings, reels) reference by id. */
const curatedDealers: Dealer[] = [
  {
    id: 'dlr_1001',
    businessName: 'Sai Krishna Motors',
    ownerName: 'Venkat Rao',
    email: 'venkat@saikrishnamotors.in',
    phone: '+91 98480 11223',
    location: { city: 'Hyderabad', state: 'Telangana' },
    status: 'active',
    plan: 'pro',
    verificationStatus: 'verified',
    activeListings: 48,
    reelsGenerated: 112,
    joinedAt: '2025-03-14T09:20:00.000Z',
    lastActiveAt: '2026-11-11T05:42:00.000Z',
  },
  {
    id: 'dlr_1002',
    businessName: 'Metro Wheels',
    ownerName: 'Ananya Iyer',
    email: 'ananya@metrowheels.in',
    phone: '+91 98450 33410',
    location: { city: 'Bengaluru', state: 'Karnataka' },
    status: 'active',
    plan: 'growth',
    verificationStatus: 'verified',
    activeListings: 31,
    reelsGenerated: 64,
    joinedAt: '2025-06-02T11:05:00.000Z',
    lastActiveAt: '2026-11-10T16:18:00.000Z',
  },
  {
    id: 'dlr_1003',
    businessName: 'Shree Ganesh Auto',
    ownerName: 'Rahul Deshmukh',
    email: 'rahul@shreeganeshauto.in',
    phone: '+91 98220 77801',
    location: { city: 'Pune', state: 'Maharashtra' },
    status: 'pending',
    plan: 'free',
    verificationStatus: 'in_review',
    activeListings: 6,
    reelsGenerated: 3,
    joinedAt: '2026-10-28T07:45:00.000Z',
    lastActiveAt: '2026-11-09T10:02:00.000Z',
  },
  {
    id: 'dlr_1004',
    businessName: 'Capital Car Bazaar',
    ownerName: 'Harpreet Singh',
    email: 'harpreet@capitalcarbazaar.in',
    phone: '+91 98110 44590',
    location: { city: 'New Delhi', state: 'Delhi' },
    status: 'active',
    plan: 'pro',
    verificationStatus: 'verified',
    activeListings: 72,
    reelsGenerated: 189,
    joinedAt: '2024-11-20T08:30:00.000Z',
    lastActiveAt: '2026-11-11T04:10:00.000Z',
  },
  {
    id: 'dlr_1005',
    businessName: 'Coastal Cars',
    ownerName: 'Joseph Fernandes',
    email: 'joseph@coastalcars.in',
    phone: '+91 98230 66172',
    location: { city: 'Panaji', state: 'Goa' },
    status: 'suspended',
    plan: 'growth',
    verificationStatus: 'rejected',
    activeListings: 0,
    reelsGenerated: 21,
    joinedAt: '2025-09-09T12:00:00.000Z',
    lastActiveAt: '2026-09-30T14:25:00.000Z',
  },
  {
    id: 'dlr_1006',
    businessName: 'Chennai Pre-Owned Hub',
    ownerName: 'Karthik Subramanian',
    email: 'karthik@chennaipreowned.in',
    phone: '+91 98400 52984',
    location: { city: 'Chennai', state: 'Tamil Nadu' },
    status: 'active',
    plan: 'growth',
    verificationStatus: 'verified',
    activeListings: 27,
    reelsGenerated: 45,
    joinedAt: '2025-12-15T06:40:00.000Z',
    lastActiveAt: '2026-11-10T09:55:00.000Z',
  },
  {
    id: 'dlr_1007',
    businessName: 'Royal Drive Autos',
    ownerName: 'Meera Joshi',
    email: 'meera@royaldrive.in',
    phone: '+91 98290 31877',
    location: { city: 'Jaipur', state: 'Rajasthan' },
    status: 'inactive',
    plan: 'free',
    verificationStatus: 'unverified',
    activeListings: 2,
    reelsGenerated: 0,
    joinedAt: '2026-04-03T10:15:00.000Z',
    lastActiveAt: '2026-06-18T08:00:00.000Z',
  },
  {
    id: 'dlr_1008',
    businessName: 'Eastern Motor Point',
    ownerName: 'Sourav Banerjee',
    email: 'sourav@easternmotorpoint.in',
    phone: '+91 98300 90412',
    location: { city: 'Kolkata', state: 'West Bengal' },
    status: 'active',
    plan: 'pro',
    verificationStatus: 'verified',
    activeListings: 39,
    reelsGenerated: 97,
    joinedAt: '2025-01-27T09:00:00.000Z',
    lastActiveAt: '2026-11-11T03:30:00.000Z',
  },
]

/*
 * Additional generated dealers so lists, pagination and filters have realistic volume.
 * Deterministic (no Math.random) so the UI is stable between reloads.
 */
const GENERATED_DEALER_SEED = [
  ['Speedway Autos', 'Nikhil Reddy', 'Visakhapatnam', 'Andhra Pradesh'],
  ['Lakeview Motors', 'Priya Nair', 'Kochi', 'Kerala'],
  ['Highway Car Mart', 'Amit Verma', 'Lucknow', 'Uttar Pradesh'],
  ['Pearl City Cars', 'Imran Khan', 'Hyderabad', 'Telangana'],
  ['Sunrise Automobiles', 'Deepa Kulkarni', 'Nagpur', 'Maharashtra'],
  ['Heritage Motors', 'Arjun Mehta', 'Ahmedabad', 'Gujarat'],
  ['Garden City Wheels', 'Lakshmi Prasad', 'Bengaluru', 'Karnataka'],
  ['Northern Drive', 'Gurdeep Kaur', 'Chandigarh', 'Punjab'],
  ['Marina Auto Hub', 'Senthil Kumar', 'Chennai', 'Tamil Nadu'],
  ['Blue Ridge Cars', 'Rohan Das', 'Guwahati', 'Assam'],
  ['Silverline Motors', 'Kavya Shetty', 'Mangaluru', 'Karnataka'],
  ['Deccan Car Point', 'Farhan Ali', 'Hyderabad', 'Telangana'],
  ['Indore Auto Plaza', 'Sneha Jain', 'Indore', 'Madhya Pradesh'],
  ['Konark Motors', 'Bikash Patnaik', 'Bhubaneswar', 'Odisha'],
  ['Twin City Autos', 'Ravi Teja', 'Vijayawada', 'Andhra Pradesh'],
  ['Valley View Cars', 'Ayesha Mir', 'Srinagar', 'Jammu and Kashmir'],
  ['Ganga Auto World', 'Vikas Pandey', 'Varanasi', 'Uttar Pradesh'],
  ['Pink City Motors', 'Rajat Saxena', 'Jaipur', 'Rajasthan'],
] as const

const STATUSES: Dealer['status'][] = ['active', 'active', 'active', 'pending', 'active', 'inactive', 'active', 'suspended']
const PLANS: Dealer['plan'][] = ['growth', 'free', 'pro', 'growth', 'free']
const VERIFICATION: Record<Dealer['status'], Dealer['verificationStatus']> = {
  active: 'verified',
  pending: 'in_review',
  inactive: 'unverified',
  suspended: 'rejected',
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '')

const generatedDealers: Dealer[] = GENERATED_DEALER_SEED.map(
  ([businessName, ownerName, city, state], index): Dealer => {
    const status = STATUSES[index % STATUSES.length]
    const isActive = status === 'active'
    const joined = new Date(Date.UTC(2025, (index * 5) % 12, 3 + ((index * 7) % 24), 9, 0))
    const lastActive = new Date(Date.UTC(2026, 10, 11 - (index % 9), 6 + (index % 8), 15))
    return {
      id: `dlr_${1101 + index}`,
      businessName,
      ownerName,
      email: `${slug(ownerName.split(' ')[0])}@${slug(businessName)}.in`,
      phone: `+91 9${String(8000000000 + index * 7919113).slice(0, 4)} ${String(10000 + index * 3571).slice(0, 5)}`,
      location: { city, state },
      status,
      plan: PLANS[index % PLANS.length],
      verificationStatus: VERIFICATION[status],
      activeListings: isActive ? 8 + ((index * 13) % 46) : (index % 3),
      reelsGenerated: isActive ? 5 + ((index * 17) % 90) : (index % 4),
      joinedAt: joined.toISOString(),
      lastActiveAt: lastActive.toISOString(),
    }
  },
)

export const mockDealers: Dealer[] = [...curatedDealers, ...generatedDealers]
