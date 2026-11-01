import { getClient, publishedWhere, SITE_URL } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['', '/deals', '/destinations', '/blog', '/posts', '/contact']

export async function GET() {
  const payload = await getClient()
  const [posts, pages, categories, destinations] = await Promise.all([
    payload.find({ collection: 'posts', where: publishedWhere(), limit: 2000, depth: 0, pagination: false }),
    payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false }),
    payload.find({ collection: 'categories', limit: 50, depth: 0, pagination: false }),
    payload.find({ collection: 'destinations', limit: 100, depth: 0, pagination: false }),
  ])
  const entry = (path: string, updatedAt: string) => `<url><loc>${SITE_URL}${path}</loc><lastmod>${updatedAt}</lastmod></url>`
  const urls = [
    ...STATIC_PATHS.map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`),
    ...categories.docs.filter((item) => item.slug !== 'blog').map((item) => entry(`/${item.slug}`, item.updatedAt)),
    ...destinations.docs.map((item) => entry(`/destinations/${item.slug}`, item.updatedAt)),
    ...pages.docs.map((item) => entry(`/${item.slug}`, item.updatedAt)),
    ...posts.docs.map((item) => entry(`/posts/${item.slug}`, item.updatedAt)),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
