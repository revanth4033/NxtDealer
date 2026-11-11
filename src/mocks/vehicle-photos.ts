/**
 * Real vehicle photos (Wikimedia Commons, see public/mock-media/vehicles/ATTRIBUTION.md), grouped into
 * colour sets per catalogue model. A vehicle uses one set, so its colour always matches its photos.
 * Sets with two or more photos have a matching reel video in public/mock-media/reels/.
 */
export interface PhotoSet {
  /** Stable key, also the reel video file name. */
  key: string
  colour: string
  photos: string[]
}

export const VEHICLE_PHOTO_SETS: Record<string, PhotoSet[]> = {
  "Maruti Suzuki Swift": [
    { key: "maruti-suzuki-swift-blue", colour: "Speedy Blue", photos: ["/mock-media/vehicles/maruti-suzuki-swift-blue-1.jpg"] },
    { key: "maruti-suzuki-swift-red", colour: "Fire Red", photos: ["/mock-media/vehicles/maruti-suzuki-swift-red-1.jpg"] },
    { key: "maruti-suzuki-swift-white", colour: "Pearl Arctic White", photos: ["/mock-media/vehicles/maruti-suzuki-swift-white-1.jpg"] },
  ],
  "Maruti Suzuki Baleno": [
    { key: "maruti-suzuki-baleno-grey", colour: "Granite Grey", photos: ["/mock-media/vehicles/maruti-suzuki-baleno-grey-1.jpg"] },
    { key: "maruti-suzuki-baleno-silver", colour: "Splendid Silver", photos: ["/mock-media/vehicles/maruti-suzuki-baleno-silver-1.jpg"] },
    { key: "maruti-suzuki-baleno-white", colour: "Arctic White", photos: ["/mock-media/vehicles/maruti-suzuki-baleno-white-1.jpg"] },
  ],
  "Hyundai i20": [
    { key: "hyundai-i20-white", colour: "Polar White", photos: ["/mock-media/vehicles/hyundai-i20-white-1.jpg", "/mock-media/vehicles/hyundai-i20-white-2.jpg"] },
    { key: "hyundai-i20-red", colour: "Fiery Red", photos: ["/mock-media/vehicles/hyundai-i20-red-1.jpg"] },
  ],
  "Tata Altroz": [
    { key: "tata-altroz-white", colour: "Avenue White", photos: ["/mock-media/vehicles/tata-altroz-white-1.jpg", "/mock-media/vehicles/tata-altroz-white-2.jpg"] },
  ],
  "Volkswagen Polo": [
    { key: "volkswagen-polo-red", colour: "Flash Red", photos: ["/mock-media/vehicles/volkswagen-polo-red-1.jpg", "/mock-media/vehicles/volkswagen-polo-red-2.jpg"] },
    { key: "volkswagen-polo-grey", colour: "Carbon Steel Grey", photos: ["/mock-media/vehicles/volkswagen-polo-grey-1.jpg"] },
  ],
  "Honda City": [
    { key: "honda-city-white", colour: "Platinum White", photos: ["/mock-media/vehicles/honda-city-white-1.jpg", "/mock-media/vehicles/honda-city-white-2.jpg"] },
    { key: "honda-city-grey", colour: "Meteoroid Grey", photos: ["/mock-media/vehicles/honda-city-grey-1.jpg"] },
  ],
  "Hyundai Verna": [
    { key: "hyundai-verna-white", colour: "Polar White", photos: ["/mock-media/vehicles/hyundai-verna-white-1.jpg", "/mock-media/vehicles/hyundai-verna-white-2.jpg"] },
    { key: "hyundai-verna-grey", colour: "Titan Grey", photos: ["/mock-media/vehicles/hyundai-verna-grey-1.jpg"] },
  ],
  "Maruti Suzuki Ciaz": [
    { key: "maruti-suzuki-ciaz-silver", colour: "Nexa Silver", photos: ["/mock-media/vehicles/maruti-suzuki-ciaz-silver-1.jpg", "/mock-media/vehicles/maruti-suzuki-ciaz-silver-2.jpg"] },
    { key: "maruti-suzuki-ciaz-maroon", colour: "Opulent Red", photos: ["/mock-media/vehicles/maruti-suzuki-ciaz-maroon-1.jpg"] },
    { key: "maruti-suzuki-ciaz-white", colour: "Pearl White", photos: ["/mock-media/vehicles/maruti-suzuki-ciaz-white-1.jpg"] },
  ],
  "Skoda Slavia": [
    { key: "skoda-slavia-grey", colour: "Carbon Steel", photos: ["/mock-media/vehicles/skoda-slavia-grey-1.jpg"] },
  ],
  "Maruti Suzuki Dzire": [
    { key: "maruti-suzuki-dzire-silver", colour: "Magma Grey", photos: ["/mock-media/vehicles/maruti-suzuki-dzire-silver-1.jpg", "/mock-media/vehicles/maruti-suzuki-dzire-silver-2.jpg"] },
    { key: "maruti-suzuki-dzire-blue", colour: "Oxford Blue", photos: ["/mock-media/vehicles/maruti-suzuki-dzire-blue-1.jpg"] },
    { key: "maruti-suzuki-dzire-bronze", colour: "Sherwood Brown", photos: ["/mock-media/vehicles/maruti-suzuki-dzire-bronze-1.jpg"] },
  ],
  "Hyundai Creta": [
    { key: "hyundai-creta-white", colour: "Atlas White", photos: ["/mock-media/vehicles/hyundai-creta-white-1.jpg", "/mock-media/vehicles/hyundai-creta-white-2.jpg"] },
    { key: "hyundai-creta-blue", colour: "Denim Blue", photos: ["/mock-media/vehicles/hyundai-creta-blue-1.jpg"] },
  ],
  "Kia Seltos": [
    { key: "kia-seltos-red", colour: "Intense Red", photos: ["/mock-media/vehicles/kia-seltos-red-1.jpg", "/mock-media/vehicles/kia-seltos-red-2.jpg"] },
    { key: "kia-seltos-blue", colour: "Intelligency Blue", photos: ["/mock-media/vehicles/kia-seltos-blue-1.jpg"] },
    { key: "kia-seltos-grey", colour: "Gravity Grey", photos: ["/mock-media/vehicles/kia-seltos-grey-1.jpg"] },
  ],
  "Tata Nexon": [
    { key: "tata-nexon-darkblue", colour: "Midnight Blue", photos: ["/mock-media/vehicles/tata-nexon-darkblue-1.jpg", "/mock-media/vehicles/tata-nexon-darkblue-2.jpg"] },
    { key: "tata-nexon-red", colour: "Flame Red", photos: ["/mock-media/vehicles/tata-nexon-red-1.jpg"] },
    { key: "tata-nexon-blue", colour: "Calgary Blue", photos: ["/mock-media/vehicles/tata-nexon-blue-1.jpg"] },
    { key: "tata-nexon-white", colour: "Pristine White", photos: ["/mock-media/vehicles/tata-nexon-white-1.jpg"] },
  ],
  "Mahindra XUV700": [
    { key: "mahindra-xuv700-black", colour: "Midnight Black", photos: ["/mock-media/vehicles/mahindra-xuv700-black-1.jpg"] },
    { key: "mahindra-xuv700-white", colour: "Everest White", photos: ["/mock-media/vehicles/mahindra-xuv700-white-1.jpg"] },
  ],
  "Toyota Fortuner": [
    { key: "toyota-fortuner-white", colour: "White Pearl", photos: ["/mock-media/vehicles/toyota-fortuner-white-1.jpg", "/mock-media/vehicles/toyota-fortuner-white-2.jpg"] },
    { key: "toyota-fortuner-silver", colour: "Silver Metallic", photos: ["/mock-media/vehicles/toyota-fortuner-silver-1.jpg"] },
  ],
  "Maruti Suzuki Brezza": [
    { key: "maruti-suzuki-brezza-blue", colour: "Pearl Blue", photos: ["/mock-media/vehicles/maruti-suzuki-brezza-blue-1.jpg", "/mock-media/vehicles/maruti-suzuki-brezza-blue-2.jpg"] },
    { key: "maruti-suzuki-brezza-grey", colour: "Magma Grey", photos: ["/mock-media/vehicles/maruti-suzuki-brezza-grey-1.jpg"] },
    { key: "maruti-suzuki-brezza-white", colour: "Pearl White", photos: ["/mock-media/vehicles/maruti-suzuki-brezza-white-1.jpg"] },
  ],
  "Kia Sonet": [
    { key: "kia-sonet-darkgrey", colour: "Gravity Grey", photos: ["/mock-media/vehicles/kia-sonet-darkgrey-1.jpg", "/mock-media/vehicles/kia-sonet-darkgrey-2.jpg"] },
    { key: "kia-sonet-grey", colour: "Steel Silver", photos: ["/mock-media/vehicles/kia-sonet-grey-1.jpg"] },
    { key: "kia-sonet-red", colour: "Intense Red", photos: ["/mock-media/vehicles/kia-sonet-red-1.jpg"] },
    { key: "kia-sonet-blue", colour: "Imperial Blue", photos: ["/mock-media/vehicles/kia-sonet-blue-1.jpg"] },
  ],
  "Toyota Innova Crysta": [
    { key: "toyota-innova-crysta-white", colour: "Super White", photos: ["/mock-media/vehicles/toyota-innova-crysta-white-1.jpg"] },
  ],
  "Maruti Suzuki Ertiga": [
    { key: "maruti-suzuki-ertiga-white", colour: "Pearl Arctic White", photos: ["/mock-media/vehicles/maruti-suzuki-ertiga-white-1.jpg", "/mock-media/vehicles/maruti-suzuki-ertiga-white-2.jpg"] },
    { key: "maruti-suzuki-ertiga-silver", colour: "Splendid Silver", photos: ["/mock-media/vehicles/maruti-suzuki-ertiga-silver-1.jpg"] },
  ],
  "Kia Carens": [
    { key: "kia-carens-white", colour: "Glacier White", photos: ["/mock-media/vehicles/kia-carens-white-1.jpg"] },
    { key: "kia-carens-grey", colour: "Gravity Grey", photos: ["/mock-media/vehicles/kia-carens-grey-1.jpg"] },
  ],
  "Maruti Suzuki XL6": [
    { key: "maruti-suzuki-xl6-white", colour: "Arctic White", photos: ["/mock-media/vehicles/maruti-suzuki-xl6-white-1.jpg"] },
  ],
}
