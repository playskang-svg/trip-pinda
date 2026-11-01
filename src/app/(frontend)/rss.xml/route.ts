import { getClient, publishedWhere, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: publishedWhere(),
    limit: 50,
    depth: 0,
    sort: '-publishedAt',
  })
  const items = docs
    .map((post) => {
      const url = `${SITE_URL}/posts/${post.slug}`
      return `<item><title>${esc(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${esc(post.summary)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`
    })
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE_TITLE)}</title><link>${SITE_URL}</link><description>${esc(SITE_DESCRIPTION)}</description><language>ko</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } })
}
