import Link from 'next/link'

import type { Post } from '@/payload-types'
import { formatDate } from '@/lib/pricing'

export function PostList({ posts, feature = false }: { posts: Post[]; feature?: boolean }) {
  if (posts.length === 0) return <p>아직 올라온 글이 없습니다.</p>
  return (
    <ul className={feature ? 'post-list post-list--feature' : 'post-list'}>
      {posts.map((post) => {
        const image = typeof post.heroImage === 'object' ? post.heroImage : null
        return (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>
              {image?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={image.alt} height={400} loading="lazy" src={image.url} width={640} />
              ) : null}
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <small>{formatDate(post.verifiedAt)} 확인</small>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
