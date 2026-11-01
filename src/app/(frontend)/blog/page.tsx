import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DestinationGrid } from '@/components/DestinationGrid'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { ShareBar } from '@/components/ShareBar'
import { getClient, publishedWhere, SITE_URL } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = '여행 블로그'
const description = '도시별 일정과 예약 순서, 입장권 고르는 법을 일정표처럼 정리했습니다.'

export const metadata: Metadata = pageMeta({ title, description, path: '/blog' })

export default async function BlogPage() {
  const payload = await getClient()
  const [posts, destinations] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { and: [...publishedWhere().and, { 'category.slug': { equals: 'blog' } }] },
      limit: 60,
      depth: 1,
      sort: '-publishedAt',
    }),
    payload.find({ collection: 'destinations', limit: 8, depth: 0, pagination: false, sort: 'order' }),
  ])
  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: title, path: '/blog' }]} />}
        lede={description}
        photo="/photos/posts.webp"
        photoAlt="카페에서 노트북으로 여행 일정을 짜는 한국인 여성"
        title={title}
      />
      <section className="section">
        <div className="frame">
          <PostList feature posts={posts.docs} />
        </div>
      </section>
      <section className="section section--tone">
        <div className="frame">
          <h2>여행지별로 바로 보기</h2>
          <DestinationGrid destinations={destinations.docs} />
          <Link className="text-link" href="/deals">
            할인코드 먼저 확인하기
          </Link>
          <ShareBar card title={title} url={`${SITE_URL}/blog`} />
        </div>
      </section>
    </>
  )
}
