import type { Showroom, ShowroomStatus } from '@/types'

/*
 * Showroom records, keyed to dealer ids in mocks/dealers.ts.
 * Every showroom is in its dealer's city; multi-showroom dealers have branches in different localities.
 *
 * Coverage
 *   Several showrooms: dlr_1001 (3, one suspended), dlr_1004, dlr_1006, dlr_1008, dlr_1101, dlr_1107 (3), dlr_1109, dlr_1113, dlr_1115
 *   One showroom:      most other dealers, including suspended dlr_1005 / dlr_1108 / dlr_1116 and inactive dlr_1007 / dlr_1106
 *   No showroom:       dlr_1003 and dlr_1104 (pending, recently joined), dlr_1110 (empty garage), dlr_1114 (inactive)
 */

type ShowroomSeed = [name: string, address: string, contactNumber: string, status?: ShowroomStatus]

const SHOWROOMS_BY_DEALER: Record<string, { city: string; showrooms: ShowroomSeed[] }> = {
  dlr_1001: {
    city: 'Hyderabad',
    showrooms: [
      ['Sai Krishna Motors, Kukatpally', 'Plot 14, KPHB Main Road, Kukatpally, Hyderabad 500072', '+91 40 2315 4410'],
      ['Sai Krishna Motors, Madhapur', '2-48/7, Hitech City Road, Madhapur, Hyderabad 500081', '+91 40 2311 0982'],
      ['Sai Krishna Motors, LB Nagar', '5-112, Sagar Ring Road, LB Nagar, Hyderabad 500074', '+91 98480 11290', 'suspended'],
    ],
  },
  dlr_1002: {
    city: 'Bengaluru',
    showrooms: [['Metro Wheels', '412, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', '+91 80 4125 3301']],
  },
  dlr_1004: {
    city: 'New Delhi',
    showrooms: [
      ['Capital Car Bazaar, Karol Bagh', '16/22, Pusa Road, Karol Bagh, New Delhi 110005', '+91 11 4150 2277'],
      ['Capital Car Bazaar, Moti Nagar', 'B-9, Najafgarh Road, Moti Nagar, New Delhi 110015', '+91 11 4553 8120'],
    ],
  },
  dlr_1005: {
    city: 'Panaji',
    showrooms: [['Coastal Cars', 'Shop 3, Dayanand Bandodkar Marg, Panaji, Goa 403001', '+91 832 242 7615', 'suspended']],
  },
  dlr_1006: {
    city: 'Chennai',
    showrooms: [
      ['Chennai Pre-Owned Hub, T. Nagar', '58, Usman Road, T. Nagar, Chennai 600017', '+91 44 2434 6620'],
      ['Chennai Pre-Owned Hub, Velachery', '211, Velachery Main Road, Velachery, Chennai 600042', '+91 44 2243 1098'],
    ],
  },
  dlr_1007: {
    city: 'Jaipur',
    showrooms: [['Royal Drive Autos', 'C-41, Tonk Road, Malviya Nagar, Jaipur 302017', '+91 141 272 8834']],
  },
  dlr_1008: {
    city: 'Kolkata',
    showrooms: [
      ['Eastern Motor Point, Salt Lake', 'DD-27, Sector 1, Salt Lake City, Kolkata 700064', '+91 33 2337 5521'],
      ['Eastern Motor Point, Tollygunge', '141, Netaji Subhash Chandra Bose Road, Tollygunge, Kolkata 700033', '+91 33 2411 7093'],
    ],
  },
  dlr_1101: {
    city: 'Visakhapatnam',
    showrooms: [
      ['Speedway Autos, Dwaraka Nagar', '47-10-21, Dwaraka Nagar Main Road, Visakhapatnam 530016', '+91 891 274 3361'],
      ['Speedway Autos, Gajuwaka', '8-3-112, NH 16 Service Road, Gajuwaka, Visakhapatnam 530026', '+91 891 251 0478'],
    ],
  },
  dlr_1102: {
    city: 'Kochi',
    showrooms: [['Lakeview Motors', '34/1120, NH 66 Bypass, Edappally, Kochi 682024', '+91 484 280 6612']],
  },
  dlr_1103: {
    city: 'Lucknow',
    showrooms: [['Highway Car Mart', '7/12, Faizabad Road, Gomti Nagar, Lucknow 226010', '+91 522 230 9147']],
  },
  dlr_1105: {
    city: 'Nagpur',
    showrooms: [['Sunrise Automobiles', '88, Wardha Road, Somalwada, Nagpur 440025', '+91 712 228 4405']],
  },
  dlr_1106: {
    city: 'Ahmedabad',
    showrooms: [['Heritage Motors', '12, Sarkhej–Gandhinagar Highway, Bodakdev, Ahmedabad 380054', '+91 79 2685 3390']],
  },
  dlr_1107: {
    city: 'Bengaluru',
    showrooms: [
      ['Garden City Wheels, Yeshwanthpur', '19, Tumkur Road, Yeshwanthpur, Bengaluru 560022', '+91 80 2337 6604'],
      ['Garden City Wheels, JP Nagar', '640, 24th Main Road, JP Nagar 6th Phase, Bengaluru 560078', '+91 80 2658 1127'],
      ['Garden City Wheels, Hebbal', '3, Bellary Road, Hebbal, Bengaluru 560024', '+91 80 2343 9918'],
    ],
  },
  dlr_1108: {
    city: 'Chandigarh',
    showrooms: [['Northern Drive', 'Plot 171, Industrial Area Phase 1, Chandigarh 160002', '+91 172 265 0731', 'suspended']],
  },
  dlr_1109: {
    city: 'Chennai',
    showrooms: [
      ['Marina Auto Hub, Anna Nagar', 'AG-14, 2nd Avenue, Anna Nagar, Chennai 600040', '+91 44 2626 4480'],
      ['Marina Auto Hub, Guindy', '72, GST Road, Guindy, Chennai 600032', '+91 44 2234 7712'],
    ],
  },
  dlr_1111: {
    city: 'Mangaluru',
    showrooms: [['Silverline Motors', 'Door 4-21/3, NH 66, Kankanady, Mangaluru 575002', '+91 824 243 1186']],
  },
  dlr_1112: {
    city: 'Hyderabad',
    showrooms: [['Deccan Car Point', '9-4-131, Tolichowki Main Road, Tolichowki, Hyderabad 500008', '+91 40 2356 8840']],
  },
  dlr_1113: {
    city: 'Indore',
    showrooms: [
      ['Indore Auto Plaza, Vijay Nagar', '27, AB Road, Vijay Nagar, Indore 452010', '+91 731 255 1430'],
      ['Indore Auto Plaza, Palasia', '5, MG Road, New Palasia, Indore 452001', '+91 731 253 6027'],
    ],
  },
  dlr_1115: {
    city: 'Vijayawada',
    showrooms: [
      ['Twin City Autos, Benz Circle', '40-1-52, MG Road, Benz Circle, Vijayawada 520010', '+91 866 247 3315'],
      ['Twin City Autos, Auto Nagar', '13-6, Service Road, Auto Nagar, Vijayawada 520007', '+91 866 254 8862'],
    ],
  },
  dlr_1116: {
    city: 'Srinagar',
    showrooms: [['Valley View Cars', '22, Residency Road, Rajbagh, Srinagar 190008', '+91 194 247 0915']],
  },
  dlr_1117: {
    city: 'Varanasi',
    showrooms: [['Ganga Auto World', 'D-59/12, Sigra–Mahmoorganj Road, Sigra, Varanasi 221010', '+91 542 222 6041']],
  },
  dlr_1118: {
    city: 'Jaipur',
    showrooms: [['Pink City Motors', '14, Queens Road, Vaishali Nagar, Jaipur 302021', '+91 141 235 7708']],
  },
}

export const mockShowrooms: Showroom[] = Object.entries(SHOWROOMS_BY_DEALER).flatMap(([dealerId, { city, showrooms }]) =>
  showrooms.map(([name, address, contactNumber, status = 'active'], index) => ({
    id: `shr_${dealerId.slice(4)}_${index + 1}`,
    dealerId,
    name,
    contactNumber,
    city,
    address,
    status,
  })),
)
