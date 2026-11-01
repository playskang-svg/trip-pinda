import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { AffiliateAnchor } from '@/components/AffiliateAnchor'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PhotoHead } from '@/components/PhotoHead'
import { ProductGrid } from '@/components/ProductGrid'
import { ShareBar } from '@/components/ShareBar'
import { getClient, SITE_URL } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

const getDestination = cache(async (slug: string) => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getDestination(slug)
  if (!item) return {}
  return pageMeta({
    title: `${item.name} 호텔·항공권·투어 할인`,
    description: item.lede,
    path: `/destinations/${item.slug}`,
  })
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
  const item = await getDestination(slug)
  if (!item) notFound()
  const payload = await getClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { destination: { equals: item.id } },
    limit: 40,
    depth: 1,
    pagination: false,
    sort: 'order',
  })
  const title = `${item.name} 여행 할인`
  return (
    <>
      <PhotoHead
        eyebrow={
          <Breadcrumbs
            items={[
              { name: '여행지', path: '/destinations' },
              { name: item.name, path: `/destinations/${item.slug}` },
            ]}
          />
        }
        lede={item.lede}
        photo={item.photo}
        photoAlt={item.photoAlt}
        title={title}
      >
        <div className="hero-actions">
          {item.links?.map((entry) => (
            <AffiliateAnchor className="button button--quiet" key={entry.id ?? entry.label} link={entry.link}>
              {entry.label}
            </AffiliateAnchor>
          ))}
        </div>
      </PhotoHead>
      {products.length ? (
        <section className="section">
          <div className="frame">
            <h2>{item.name}에서 많이 찾는 상품</h2>
            <ProductGrid products={products} />
            <Link className="text-link" href="/deals">
              결제 전에 할인코드 확인하기
            </Link>
          </div>
        </section>
      ) : null}
      <div className="frame">
        <ShareBar card title={title} url={`${SITE_URL}/destinations/${item.slug}`} />
      </div>
    </>
  )
}
