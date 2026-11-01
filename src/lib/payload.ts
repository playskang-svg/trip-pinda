import config from '@payload-config'
import { getPayload } from 'payload'

export const getClient = () => getPayload({ config })

export const SITE_URL = 'https://trip.pinda.kr'
export const SITE_NAME = '여행할인 정보센터'
// Without the space: people type the name as one word into Naver.
export const SITE_NAME_COMPACT = '여행할인정보센터'
export const SITE_TITLE = `${SITE_NAME_COMPACT} — 호텔·항공권·투어·이심 할인코드 및 특가 프로모션`
export const SITE_DESCRIPTION =
  '여행할인정보센터는 아고다·트립닷컴·클룩 등 호텔·항공권·투어 액티비티·이심(eSIM)·렌터카 공식 할인코드와 최신 특가 프로모션을 모아 정리하는 여행 경비 절약 가이드입니다.'
export const DISCLOSURE =
  '이 사이트는 제휴마케팅이 포함된 광고로, 링크를 통해 예약하면 운영자가 일정 수수료를 받을 수 있습니다. 구매자가 내는 금액은 달라지지 않습니다.'

export const publishedWhere = () => ({
  and: [
    { _status: { equals: 'published' as const } },
    { publishedAt: { less_than_equal: new Date().toISOString() } },
  ],
})

// Media URLs already carry serverURL in production and are relative elsewhere.
export const absoluteUrl = (url: string): string => (url.startsWith('http') ? url : `${SITE_URL}${url}`)
