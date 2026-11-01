import type { Metadata } from 'next'
import Link from 'next/link'

import { DealList } from '@/components/DealList'
import { DestinationGrid } from '@/components/DestinationGrid'
import { JsonLd } from '@/components/JsonLd'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { ProductGrid } from '@/components/ProductGrid'
import { getActiveDeals } from '@/lib/deals'
import {
  getClient,
  publishedWhere,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_COMPACT,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/payload'
import { pageMeta, publisher } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...pageMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/' }),
  title: { absolute: SITE_TITLE },
}

export default async function HomePage() {
  const payload = await getClient()
  const [deals, categories, destinations, products, posts] = await Promise.all([
    getActiveDeals({ featured: { equals: true } }),
    payload.find({ collection: 'categories', limit: 20, depth: 0, pagination: false, sort: 'order' }),
    payload.find({ collection: 'destinations', limit: 8, depth: 0, pagination: false, sort: 'order' }),
    payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 12, depth: 1, pagination: false, sort: 'order' }),
    payload.find({ collection: 'posts', where: publishedWhere(), limit: 6, depth: 1, sort: '-publishedAt' }),
  ])

  return (
    <>
      <JsonLd
        data={{
          '@type': 'WebSite',
          name: SITE_NAME_COMPACT,
          alternateName: [SITE_NAME, 'trip.pinda.kr'],
          url: SITE_URL,
          inLanguage: 'ko-KR',
          description: SITE_DESCRIPTION,
          publisher,
        }}
      />
      <PhotoHead
        eyebrow={<p className="post__category">{SITE_NAME_COMPACT}</p>}
        lede="호텔, 항공권, 투어, 렌터카, 이심까지 지금 쓸 수 있는 코드를 조건과 기간으로 정리했습니다."
        photo="/photos/hero.webp"
        photoAlt="여행 가방을 끌고 공항을 걷는 한국인 여성"
        tall
        title="결제 버튼 누르기 전, 코드부터 넣으세요"
      >
        <div className="hero-actions">
          <Link className="button button--go" href="/deals">
            할인코드 전체 보기
          </Link>
          <Link className="button button--quiet" href="/destinations">
            여행지로 찾기
          </Link>
        </div>
      </PhotoHead>

      <nav aria-label="분야" className="section section--slim">
        <div className="frame">
          <ul className="topics">
            {categories.docs.map((category) => (
              <li key={category.id}>
                <Link href={`/${category.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" height={200} loading="lazy" src={category.photo} width={320} />
                  <span>{category.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section section--tone" id="deals">
        <div className="frame">
          <h2>이번 달 놓치면 아까운 코드</h2>
          <p className="section-lede">
            렌터카 코드 하나를 빠뜨리면 최대 4만 원, 중국 항공권 코드를 빠뜨리면 최대 5만 원을 그대로 더 냅니다.
          </p>
          <DealList deals={deals} />
          <Link className="text-link" href="/deals">
            할인 전체 보기
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="frame">
          <h2>어디로 떠나세요?</h2>
          <DestinationGrid destinations={destinations.docs} />
          <Link className="text-link" href="/destinations">
            여행지 전체 보기
          </Link>
        </div>
      </section>

      <section className="section section--tone">
        <div className="frame">
          <h2>많이 찾는 투어와 입장권</h2>
          <ProductGrid products={products.docs} />
          <Link className="text-link" href="/tours">
            투어·입장권 더 보기
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="frame">
          <h2>예약 전에 읽는 글</h2>
          <PostList feature posts={posts.docs} />
        </div>
      </section>
    </>
  )
}
