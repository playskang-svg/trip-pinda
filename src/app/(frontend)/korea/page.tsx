import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DealList } from '@/components/DealList'
import { DestinationGrid } from '@/components/DestinationGrid'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { ProductGrid } from '@/components/ProductGrid'
import { ShareBar } from '@/components/ShareBar'
import { getDomesticDeals } from '@/lib/deals'
import { ALL_REVIEWS, isDomestic, regionOf, REGIONS } from '@/lib/korea'
import { getClient, publishedWhere, SITE_URL } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = '국내 호텔 할인, 지역별 호텔·숙소 모음'
const description = '서울, 부산, 제주, 강릉, 속초, 경주, 여수까지 지역별 호텔·숙소와 호캉스 리뷰, 지금 받을 수 있는 숙소 쿠폰을 모았습니다.'

export const metadata: Metadata = pageMeta({ title, description, path: '/korea' })

export default async function KoreaPage() {
  const payload = await getClient()
  const [deals, destinations, hotels, posts] = await Promise.all([
    getDomesticDeals(),
    payload.find({ collection: 'destinations', limit: 100, depth: 0, pagination: false, sort: 'order' }),
    payload.find({ collection: 'products', where: { slug: { like: 'yeogi-' } }, limit: 16, depth: 1, pagination: false, sort: 'order' }),
    payload.find({
      collection: 'posts',
      where: { and: [...publishedWhere().and, { slug: { in: ALL_REVIEWS } }] },
      limit: ALL_REVIEWS.length,
      depth: 1,
      sort: '-publishedAt',
    }),
  ])
  const cities = destinations.docs.filter(isDomestic)
  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: '국내 호텔', path: '/korea' }]} />}
        lede={description}
        photo="/photos/hotel-66687.webp"
        photoAlt="그랜드 조선 제주 전경"
        title={title}
      />
      {deals.length ? (
        <section className="section section--tone">
          <div className="frame">
            <h2>결제 전에 받아 두는 국내 숙소 할인</h2>
            <p className="section-lede">같은 객실도 쿠폰을 받았는지에 따라 결제액이 달라집니다. 안 받고 결제하면 그 차액을 그대로 더 냅니다.</p>
            <DealList deals={deals} />
          </div>
        </section>
      ) : null}
      <section className="section">
        <div className="frame">
          <h2>지역별 호텔·숙소</h2>
          {REGIONS.map((region) => {
            const items = cities.filter((item) => regionOf(item) === region)
            return items.length ? (
              <div className="region" key={region}>
                <h3>{region}</h3>
                <DestinationGrid destinations={items} />
              </div>
            ) : null
          })}
        </div>
      </section>
      {posts.docs.length ? (
        <section className="section section--tone">
          <div className="frame">
            <h2>호캉스 전에 읽는 호텔 리뷰</h2>
            <PostList posts={posts.docs} />
          </div>
        </section>
      ) : null}
      {hotels.docs.length ? (
        <section className="section">
          <div className="frame">
            <h2>가격 바로 보기</h2>
            <ProductGrid products={hotels.docs} />
            <Link className="text-link" href="/hotels">
              해외 호텔까지 보기
            </Link>
          </div>
        </section>
      ) : null}
      <div className="frame">
        <ShareBar card title={title} url={`${SITE_URL}/korea`} />
      </div>
    </>
  )
}
