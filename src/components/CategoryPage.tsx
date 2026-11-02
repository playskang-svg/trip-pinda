import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DealList } from '@/components/DealList'
import { DestinationLinks } from '@/components/DestinationLinks'
import { PartnerGrid } from '@/components/PartnerGrid'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { ProductGrid } from '@/components/ProductGrid'
import { ShareBar } from '@/components/ShareBar'
import { getActiveDeals } from '@/lib/deals'
import { isDomestic } from '@/lib/korea'
import { getClient, publishedWhere, SITE_URL } from '@/lib/payload'
import type { Category } from '@/payload-types'

const CITY_LINKS: Record<string, 'hotel' | 'flight'> = { hotels: 'hotel', flights: 'flight' }

export async function CategoryPage({ category }: { category: Category }) {
  const payload = await getClient()
  const cityKind = CITY_LINKS[category.slug]
  const [deals, partners, posts, destinations, products] = await Promise.all([
    getActiveDeals({ category: { equals: category.slug } }),
    payload.find({
      collection: 'partners',
      where: { categories: { contains: category.slug } },
      limit: 30,
      depth: 1,
      pagination: false,
      sort: 'order',
    }),
    payload.find({
      collection: 'posts',
      where: { and: [...publishedWhere().and, { category: { equals: category.id } }] },
      limit: 12,
      depth: 1,
      sort: '-publishedAt',
    }),
    cityKind ? payload.find({ collection: 'destinations', limit: 100, depth: 1, pagination: false, sort: 'order' }) : null,
    category.slug === 'tours'
      ? payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 24, depth: 1, pagination: false, sort: 'order' })
      : null,
  ])
  const url = `${SITE_URL}/${category.slug}`

  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: category.title, path: `/${category.slug}` }]} />}
        lede={category.lede}
        photo={category.photo}
        photoAlt={category.photoAlt}
        title={`${category.title} 할인`}
      />
      {deals.length ? (
        <section className="section section--tone">
          <div className="frame">
            <h2>지금 쓸 수 있는 할인</h2>
            <DealList deals={deals} />
          </div>
        </section>
      ) : null}
      {cityKind === 'hotel' && destinations ? (
        <section className="section">
          <div className="frame">
            <h2>국내 호텔, 지역별로 바로 보기</h2>
            <DestinationLinks destinations={destinations.docs.filter(isDomestic)} kind={cityKind} />
            <Link className="text-link" href="/korea">
              국내 호텔 리뷰와 쿠폰 모아 보기
            </Link>
          </div>
        </section>
      ) : null}
      {cityKind && destinations ? (
        <section className="section">
          <div className="frame">
            <h2>{cityKind === 'hotel' ? '해외 호텔, 도시별로 바로 보기' : '도시별로 바로 보기'}</h2>
            <DestinationLinks destinations={destinations.docs.filter((item) => !isDomestic(item))} kind={cityKind} />
          </div>
        </section>
      ) : null}
      {products ? (
        <section className="section">
          <div className="frame">
            <h2>많이 찾는 투어와 입장권</h2>
            <ProductGrid products={products.docs} />
          </div>
        </section>
      ) : null}
      {partners.docs.length ? (
        <section className="section">
          <div className="frame">
            <h2>예약할 곳 고르기</h2>
            <PartnerGrid partners={partners.docs} />
          </div>
        </section>
      ) : null}
      {posts.docs.length ? (
        <section className="section section--tone">
          <div className="frame">
            <h2>예약 전에 읽는 글</h2>
            <PostList posts={posts.docs} />
          </div>
        </section>
      ) : null}
      <div className="frame">
        <ShareBar card title={`${category.title} 할인`} url={url} />
      </div>
    </>
  )
}
