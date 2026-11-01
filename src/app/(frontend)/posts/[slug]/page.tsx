import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DealList } from '@/components/DealList'
import { JsonLd } from '@/components/JsonLd'
import { PhotoHead } from '@/components/PhotoHead'
import { RichText } from '@/components/RichText'
import { ShareBar } from '@/components/ShareBar'
import { absoluteUrl, getClient, publishedWhere, SITE_URL } from '@/lib/payload'
import { formatDate, isActiveDeal } from '@/lib/pricing'
import { pageMeta, publisher } from '@/lib/seo'
import type { Deal } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

const getPost = cache(async (slug: string) => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [...publishedWhere().and, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const og = typeof post.ogImage === 'object' ? post.ogImage?.url : null
  const image = og ? absoluteUrl(og) : '/og-default.png'
  const category = typeof post.category === 'object' ? post.category : null
  return pageMeta({
    title: post.metaTitle || post.title,
    description: post.summary,
    path: `/posts/${post.slug}`,
    image,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: category?.title,
    },
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const hero = typeof post.heroImage === 'object' ? post.heroImage : null
  const category = typeof post.category === 'object' ? post.category : null
  const now = new Date()
  const deals = (post.deals ?? []).filter((d): d is Deal => typeof d === 'object' && isActiveDeal(d, now))
  const related = (post.relatedPosts ?? []).filter((p) => typeof p === 'object')
  const url = `${SITE_URL}/posts/${post.slug}`

  return (
    <article className="post">
      <JsonLd
        data={{
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: hero?.url ? absoluteUrl(hero.url) : undefined,
          mainEntityOfPage: url,
          articleSection: category?.title,
          inLanguage: 'ko-KR',
          author: publisher,
          publisher,
        }}
      />
      <PhotoHead
        eyebrow={
          <Breadcrumbs
            items={[
              ...(category ? [{ name: category.title, path: `/${category.slug}` }] : []),
              { name: post.title, path: `/posts/${post.slug}` },
            ]}
          />
        }
        lede={`${formatDate(post.verifiedAt)} 프로모션 안내 기준으로 확인`}
        photo={hero?.url}
        photoAlt={hero?.alt}
        title={post.title}
      />
      <div className="frame frame--text post__body">
        <aside className="summary">
          <strong>💡 핵심 한 줄 요약</strong>
          <p>{post.summary}</p>
        </aside>
        <RichText
          data={post.content}
          midway={
            deals.length ? (
              <aside className="post-deals">
                <strong>코드와 예약 버튼을 함께 놓았습니다</strong>
                <DealList deals={deals} />
              </aside>
            ) : null
          }
        />
        {related.length ? (
          <section className="link-cards" aria-label="함께 보면 좋은 글">
            {related.map((item) => {
              if (typeof item !== 'object') return null
              const image = typeof item.heroImage === 'object' ? item.heroImage : null
              return (
                <Link className="link-card" href={`/posts/${item.slug}`} key={item.id}>
                  {image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" height={300} loading="lazy" src={image.url} width={480} />
                  ) : null}
                  <span>
                    <strong>{item.title}</strong>
                    {item.summary}
                  </span>
                </Link>
              )
            })}
          </section>
        ) : null}
        <p className="disclosure">
          혜택은 예고 없이 바뀌거나 조기 종료될 수 있으니 결제 화면에서 적용 금액을 확인해 주세요.
        </p>
        <ShareBar card text={post.summary} title={post.title} url={url} />
      </div>
    </article>
  )
}
