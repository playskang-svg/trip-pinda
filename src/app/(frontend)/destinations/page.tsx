import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DestinationGrid } from '@/components/DestinationGrid'
import { PhotoHead } from '@/components/PhotoHead'
import { isDomestic } from '@/lib/korea'
import { getClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = '여행지별 할인'
const description = '서울·부산·제주·강릉 호텔부터 도쿄·오사카·다낭·방콕의 호텔, 항공권, 투어까지 바로 비교하세요.'

export const metadata: Metadata = pageMeta({ title, description, path: '/destinations' })

export default async function DestinationsPage() {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    limit: 100,
    depth: 0,
    pagination: false,
    sort: 'order',
  })
  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: '여행지', path: '/destinations' }]} />}
        lede={description}
        photo="/photos/hero.webp"
        photoAlt="여행 가방을 끌고 공항을 걷는 한국인 여성"
        title={title}
      />
      <section className="section">
        <div className="frame">
          <h2>국내</h2>
          <DestinationGrid destinations={docs.filter(isDomestic)} />
          <Link className="text-link" href="/korea">
            국내 호텔 리뷰와 쿠폰 보기
          </Link>
          <h2 className="heading-gap">해외</h2>
          <DestinationGrid destinations={docs.filter((item) => !isDomestic(item))} />
          <Link className="text-link" href="/deals">
            할인코드 전체 보기
          </Link>
        </div>
      </section>
    </>
  )
}
