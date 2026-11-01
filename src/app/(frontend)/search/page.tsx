import type { Metadata } from 'next'

import { PostList } from '@/components/PostList'
import { getClient, publishedWhere } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: '글 검색', robots: { index: false, follow: true } }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const q = ((await searchParams).q ?? '').trim().slice(0, 50)
  const payload = await getClient()
  const results = q
    ? await payload.find({
        collection: 'posts',
        where: {
          and: [
            ...publishedWhere().and,
            { or: [{ title: { contains: q } }, { summary: { contains: q } }] },
          ],
        },
        limit: 30,
        depth: 1,
      })
    : null
  return (
    <section className="section page-head">
      <div className="frame">
        <h1>{q ? `‘${q}’ 검색 결과` : '글 검색'}</h1>
        {results ? <PostList posts={results.docs} /> : <p>찾을 여행지나 서비스 이름을 입력해 주세요.</p>}
      </div>
    </section>
  )
}
