import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PhotoHead } from '@/components/PhotoHead'
import { PostList } from '@/components/PostList'
import { getClient, publishedWhere } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: '전체 글',
  description: '여행 할인코드 사용법과 호텔·항공권·투어 예약 요령을 다룬 글 모음입니다.',
  path: '/posts',
})

export default async function PostsPage() {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: publishedWhere(),
    limit: 100,
    depth: 1,
    sort: '-publishedAt',
  })
  return (
    <>
      <PhotoHead
        eyebrow={<Breadcrumbs items={[{ name: '전체 글', path: '/posts' }]} />}
        lede="여행 할인코드 사용법과 호텔·항공권·투어 예약 요령을 모았습니다."
        photo="/photos/posts.webp"
        photoAlt="카페에서 노트북으로 여행 일정을 짜는 한국인 여성"
        title="전체 글"
      />
      <section className="section">
        <div className="frame">
          <PostList feature posts={docs} />
        </div>
      </section>
    </>
  )
}
