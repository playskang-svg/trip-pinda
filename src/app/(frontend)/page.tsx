import type { Metadata } from 'next'
import Link from 'next/link'

import { DealList } from '@/components/DealList'
import { DestinationGrid } from '@/components/DestinationGrid'
import { JsonLd } from '@/components/JsonLd'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { ProductGrid } from '@/components/ProductGrid'
import { getActiveDeals } from '@/lib/deals'
import { retina } from '@/lib/images'
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
  const [deals, categories, destinations, products, posts, domestic] = await Promise.all([
    getActiveDeals({ featured: { equals: true } }),
    payload.find({ collection: 'categories', where: { slug: { not_equals: 'blog' } }, limit: 20, depth: 0, pagination: false, sort: 'order' }),
    payload.find({ collection: 'destinations', limit: 8, depth: 0, pagination: false, sort: 'order' }),
    payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 12, depth: 1, pagination: false, sort: 'order' }),
    payload.find({ collection: 'posts', where: publishedWhere(), limit: 6, depth: 1, sort: '-publishedAt' }),
    payload.find({ collection: 'destinations', where: { country: { like: '국내' } }, limit: 8, depth: 0, pagination: false, sort: 'order' }),
  ])

  return (
    <>
      <JsonLd
        data={{
          '@type': 'WebSite',
          name: SITE_NAME,
          alternateName: [SITE_NAME_COMPACT, '여행할인 정보센터', 'trip.pinda.kr'],
          url: SITE_URL,
          inLanguage: 'ko-KR',
          description: SITE_DESCRIPTION,
          publisher,
        }}
      />
      <PhotoHead
        eyebrow={<p className="post__category">{SITE_NAME} · {SITE_NAME_COMPACT}</p>}
        lede="핀다여행쿠폰은 호텔, 항공권, 투어, 렌터카, 이심까지 지금 쓸 수 있는 코드와 쿠폰을 조건과 기간으로 정리했습니다."
        clip={{ src: '/video/hero.mp4', mobileSrc: '/video/hero-m.mp4', poster: '/video/hero.webp', mobilePoster: '/video/hero-m.webp' }}
        photoAlt="공항 창가를 걷는 여행객이 휴대폰을 보는 장면"
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
                  <img alt="" height={200} loading="lazy" src={category.photo} srcSet={retina(category.photo)} width={320} />
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

      {domestic.docs.length ? (
        <section className="section">
          <div className="frame">
            <h2>국내 호텔·숙소, 지역별로 고르기</h2>
            <DestinationGrid destinations={domestic.docs} />
            <Link className="text-link" href="/korea">
              국내 호텔 리뷰와 쿠폰 보기
            </Link>
          </div>
        </section>
      ) : null}

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
          <h2>여행 블로그</h2>
          <PostList feature posts={posts.docs} />
          <Link className="text-link" href="/blog">
            여행 블로그 전체 보기
          </Link>
        </div>
      </section>
    </>
  )
}
