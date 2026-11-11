import type { Showroom, ShowroomStatus } from '@/types'

/*
 * Showroom records, keyed to dealer ids in mocks/dealers.ts. The NxtDealer app currently supports one
 * showroom per dealer, so each dealer has at most one record here (the type enforces it). The service and
 * `Showroom` model already return a list per dealer, ready for multi-branch support later.
 *
 * Coverage
 *   Active showroom:    most dealers, including dlr_1116 Valley View Cars (dealer account Suspended)
 *   Suspended showroom: dlr_1001 Sai Krishna Motors (dealer account Active, so the statuses differ),
 *                       dlr_1005 Coastal Cars and dlr_1108 Northern Drive (dealer accounts Suspended)
 *   No showroom:        dlr_1003 and dlr_1104 (recently joined), dlr_1110 (empty garage), dlr_1114
 */

type ShowroomSeed = [name: string, address: string, contactNumber: string, status?: ShowroomStatus]

const SHOWROOM_BY_DEALER: Record<string, { city: string; showroom: ShowroomSeed }> = {
  dlr_1001: {
    city: 'Hyderabad',
    showroom: ['Sai Krishna Motors, LB Nagar', '5-112, Sagar Ring Road, LB Nagar, Hyderabad 500074', '+91 98480 11290', 'suspended'],
  },
  dlr_1002: {
    city: 'Bengaluru',
    showroom: ['Metro Wheels', '412, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', '+91 80 4125 3301'],
  },
  dlr_1004: {
    city: 'New Delhi',
    showroom: ['Capital Car Bazaar, Karol Bagh', '16/22, Pusa Road, Karol Bagh, New Delhi 110005', '+91 11 4150 2277'],
  },
  dlr_1005: {
    city: 'Panaji',
    showroom: ['Coastal Cars', 'Shop 3, Dayanand Bandodkar Marg, Panaji, Goa 403001', '+91 832 242 7615', 'suspended'],
  },
  dlr_1006: {
    city: 'Chennai',
    showroom: ['Chennai Pre-Owned Hub, T. Nagar', '58, Usman Road, T. Nagar, Chennai 600017', '+91 44 2434 6620'],
  },
  dlr_1007: {
    city: 'Jaipur',
    showroom: ['Royal Drive Autos', 'C-41, Tonk Road, Malviya Nagar, Jaipur 302017', '+91 141 272 8834'],
  },
  dlr_1008: {
    city: 'Kolkata',
    showroom: ['Eastern Motor Point, Salt Lake', 'DD-27, Sector 1, Salt Lake City, Kolkata 700064', '+91 33 2337 5521'],
  },
  dlr_1101: {
    city: 'Visakhapatnam',
    showroom: ['Speedway Autos, Dwaraka Nagar', '47-10-21, Dwaraka Nagar Main Road, Visakhapatnam 530016', '+91 891 274 3361'],
  },
  dlr_1102: {
    city: 'Kochi',
    showroom: ['Lakeview Motors', '34/1120, NH 66 Bypass, Edappally, Kochi 682024', '+91 484 280 6612'],
  },
  dlr_1103: {
    city: 'Lucknow',
    showroom: ['Highway Car Mart', '7/12, Faizabad Road, Gomti Nagar, Lucknow 226010', '+91 522 230 9147'],
  },
  dlr_1105: {
    city: 'Nagpur',
    showroom: ['Sunrise Automobiles', '88, Wardha Road, Somalwada, Nagpur 440025', '+91 712 228 4405'],
  },
  dlr_1106: {
    city: 'Ahmedabad',
    showroom: ['Heritage Motors', '12, Sarkhej–Gandhinagar Highway, Bodakdev, Ahmedabad 380054', '+91 79 2685 3390'],
  },
  dlr_1107: {
    city: 'Bengaluru',
    showroom: ['Garden City Wheels, Yeshwanthpur', '19, Tumkur Road, Yeshwanthpur, Bengaluru 560022', '+91 80 2337 6604'],
  },
  dlr_1108: {
    city: 'Chandigarh',
    showroom: ['Northern Drive', 'Plot 171, Industrial Area Phase 1, Chandigarh 160002', '+91 172 265 0731', 'suspended'],
  },
  dlr_1109: {
    city: 'Chennai',
    showroom: ['Marina Auto Hub, Anna Nagar', 'AG-14, 2nd Avenue, Anna Nagar, Chennai 600040', '+91 44 2626 4480'],
  },
  dlr_1111: {
    city: 'Mangaluru',
    showroom: ['Silverline Motors', 'Door 4-21/3, NH 66, Kankanady, Mangaluru 575002', '+91 824 243 1186'],
  },
  dlr_1112: {
    city: 'Hyderabad',
    showroom: ['Deccan Car Point', '9-4-131, Tolichowki Main Road, Tolichowki, Hyderabad 500008', '+91 40 2356 8840'],
  },
  dlr_1113: {
    city: 'Indore',
    showroom: ['Indore Auto Plaza, Vijay Nagar', '27, AB Road, Vijay Nagar, Indore 452010', '+91 731 255 1430'],
  },
  dlr_1115: {
    city: 'Vijayawada',
    showroom: ['Twin City Autos, Benz Circle', '40-1-52, MG Road, Benz Circle, Vijayawada 520010', '+91 866 247 3315'],
  },
  dlr_1116: {
    city: 'Srinagar',
    showroom: ['Valley View Cars', '22, Residency Road, Rajbagh, Srinagar 190008', '+91 194 247 0915'],
  },
  dlr_1117: {
    city: 'Varanasi',
    showroom: ['Ganga Auto World', 'D-59/12, Sigra–Mahmoorganj Road, Sigra, Varanasi 221010', '+91 542 222 6041'],
  },
  dlr_1118: {
    city: 'Jaipur',
    showroom: ['Pink City Motors', '14, Queens Road, Vaishali Nagar, Jaipur 302021', '+91 141 235 7708'],
  },
}

export const mockShowrooms: Showroom[] = Object.entries(SHOWROOM_BY_DEALER).map(
  ([dealerId, { city, showroom: [name, address, contactNumber, status = 'active'] }]) => ({
    id: `shr_${dealerId.slice(4)}`,
    dealerId,
    name,
    contactNumber,
    city,
    address,
    status,
  }),
)
