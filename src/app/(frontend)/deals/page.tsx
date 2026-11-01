import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DealList } from '@/components/DealList'
import { PhotoHead } from '@/components/PhotoHead'
import { ShareBar } from '@/components/ShareBar'
import { getActiveDeals } from '@/lib/deals'
import { getClient, SITE_URL } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = '여행 할인코드·프로모션'
const description = '클룩·트립닷컴·트래블로카·KKday 할인코드와 자동 할인, 기획전을 조건과 기간까지 한곳에 모았습니다.'

export const metadata: Metadata = pageMeta({ title, description, path: '/deals' })

const GROUPS = [
  { type: 'code', id: 'code', name: '할인코드', lede: '복사해서 결제 화면에 넣으면 바로 내려갑니다.' },
  { type: 'auto', id: 'auto', name: '자동 할인', lede: '코드 없이 이 경로로 들어가면 결제 금액에서 빠집니다.' },
  { type: 'event', id: 'event', name: '기획전·특가', lede: '기간 한정으로 열리는 특가 페이지입니다.' },
] as const

export default async function DealsPage() {
  const payload = await getClient()
  const [deals, categories] = await Promise.all([
    getActiveDeals(),
    payload.find({ collection: 'categories', where: { slug: { not_equals: 'blog' } }, limit: 20, depth: 0, pagination: false, sort: 'order' }),
  ])
  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: '할인 모음', path: '/deals' }]} />}
        lede="코드는 복사한 뒤 같은 카드를 눌러 들어간 예약 화면에서 넣으세요. 다른 경로로 들어가면 적용되지 않는 코드가 많습니다."
        photo="/photos/deals.webp"
        photoAlt="공항 벤치에서 휴대폰으로 할인코드를 확인하는 한국인 여성"
        title={title}
      />
      <nav aria-label="분야별 할인" className="section section--slim">
        <div className="frame chips">
          {GROUPS.map((group) => (
            <a href={`#${group.id}`} key={group.id}>
              {group.name}
            </a>
          ))}
          {categories.docs.map((category) => (
            <Link href={`/${category.slug}`} key={category.id}>
              {category.title}
            </Link>
          ))}
        </div>
      </nav>
      {GROUPS.map((group, index) => {
        const items = deals.filter((deal) => deal.type === group.type)
        if (!items.length) return null
        return (
          <section className={index % 2 ? 'section' : 'section section--tone'} id={group.id} key={group.id}>
            <div className="frame">
              <h2>{group.name}</h2>
              <p className="section-lede">{group.lede}</p>
              <DealList deals={items} />
            </div>
          </section>
        )
      })}
      <div className="frame">
        <ShareBar card title={title} url={`${SITE_URL}/deals`} />
      </div>
    </>
  )
}
