import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DestinationGrid } from '@/components/DestinationGrid'
import { PhotoHead } from '@/components/PhotoHead'
import { getClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = '여행지별 할인'
const description = '도쿄·오사카·후쿠오카·오키나와·다낭·나트랑·방콕·타이베이의 호텔, 항공권, 투어를 바로 비교하세요.'

export const metadata: Metadata = pageMeta({ title, description, path: '/destinations' })

export default async function DestinationsPage() {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    limit: 50,
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
          <DestinationGrid destinations={docs} />
          <Link className="text-link" href="/deals">
            할인코드 전체 보기
          </Link>
        </div>
      </section>
    </>
  )
}
