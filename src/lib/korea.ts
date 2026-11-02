import type { Destination } from '@/payload-types'

// Domestic cities carry their region in the country field: '국내 · 강원'.
export const isDomestic = (item: Pick<Destination, 'country'>) => item.country.startsWith('국내')
export const regionOf = (item: Pick<Destination, 'country'>) => item.country.split('·')[1]?.trim() ?? ''
export const REGIONS = ['수도권', '강원', '충청', '전라', '경상', '제주']

// Posts have no city field, and a title like "해운대 오션뷰 호텔" does not name its city.
export const REVIEWS_BY_CITY: Record<string, string[]> = {
  seoul: ['signiel-seoul-review', 'grand-walkerhill-review', 'lotte-hotel-seoul-review', 'josun-palace-review', 'shilla-stay-gwanghwamun-review'],
  incheon: ['inspire-resort-review', 'paradise-city-review'],
  busan: ['signiel-busan-review', 'grand-josun-busan-review', 'paradise-busan-review', 'ananti-busan-cove-review', 'homers-hotel-review'],
  jeju: ['grand-josun-jeju-review', 'parnas-jeju-review', 'shilla-jeju-review', 'lotte-jeju-review', 'haevichi-jeju-review'],
  gangneung: ['st-johns-gangneung-review', 'skybay-gyeongpo-review'],
  sokcho: ['kasia-sokcho-review', 'lotte-resort-sokcho-review'],
  yangyang: ['solbeach-yangyang-review'],
  gyeongju: ['lahan-gyeongju-review'],
  yeosu: ['sono-calm-yeosu-review', 'hiddenbay-yeosu-review'],
  jeonju: ['lahan-jeonju-review'],
  daegu: ['marriott-daegu-review'],
  daejeon: ['onoma-daejeon-review'],
  geoje: ['sono-calm-geoje-review'],
  namhae: ['ananti-namhae-review'],
}
export const ALL_REVIEWS = Object.values(REVIEWS_BY_CITY).flat()
