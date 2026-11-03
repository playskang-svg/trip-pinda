// Fills links, deals, destinations, products, pages and posts. Safe to re-run: records are matched by slug.
// Run: NODE_ENV=production pnpm payload run scripts/seed.ts   (remote D1 and R2)
import fs from 'node:fs'
import path from 'node:path'

import { type CollectionSlug, getPayload } from 'payload'

import config from '../src/payload.config'
import {
  type Block,
  categories,
  deals,
  destinations,
  featuredProducts,
  navigation,
  pages,
  partners,
  photos,
  posts as guidePosts,
  VERIFIED,
} from './seed-data'
import { blogPosts } from './seed-blog'
import { coined, trendPosts } from './seed-trends'

type IssuedLink = { url?: string; title?: string; program?: string; landing: string; error?: string }
type CatalogEntry = {
  name: string
  slug: string
  links: Record<string, string>
  products: { slug: string; partner: string; title: string; image?: string }[]
}

const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.resolve('scripts', file), 'utf8'))
// Hotel reviews, written from the partner's ratings, guest reviews and facility data. Nobody here stayed at these hotels.
const REVIEW_VERIFIED = '2026-11-02T12:00:00.000Z'
const REVIEW_NOTE = '직접 투숙한 후기가 아닙니다. 판매처에 표시된 평점·투숙객 후기·시설 정보를 2026년 11월 2일에 확인해 정리했으며, 운영 조건은 바뀔 수 있습니다.'
const reviews = readJson<(typeof blogPosts)[number][]>('reviews.json')
const reviewSlugs = new Set(reviews.map((post) => post.slug))
// Topics people ask about in Naver review blogs and cafes, written from partner data and public rules, not from a trip.
const BLOG_VERIFIED = '2026-11-03T12:00:00.000Z'
const blog = fs.existsSync(path.resolve('scripts', 'blog.json')) ? readJson<(typeof blogPosts)[number][]>('blog.json') : []
const blogSlugs = new Set(blog.map((post) => post.slug))
const posts = [...blog, ...reviews, ...trendPosts, ...blogPosts, ...guidePosts]

// These programs pay nothing for content whose title carries their brand name.
for (const { title } of [...posts, ...pages, ...categories]) {
  if (/여기어때|찜카/.test(title)) throw new Error(`forbidden brand in title: ${title}`)
}

const issued = readJson<Record<string, IssuedLink>>('links.json')
const catalog = readJson<Record<string, CatalogEntry>>('catalog.json')
const logos = readJson<Record<string, string>>('logos.json')

const payload = await getPayload({ config })
const PHOTO_DIR = path.resolve('public/photos')
const OG_DIR = path.resolve('og')
const PUBLIC = path.resolve('public')
const publicFile = (web: string) => (fs.existsSync(path.join(PUBLIC, web)) ? web : undefined)

/* eslint-disable @typescript-eslint/no-explicit-any */
const upsert = async (collection: CollectionSlug, where: any, data: any): Promise<any> => {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0, draft: true })
  if (docs[0]) return payload.update({ collection, id: docs[0].id, data, depth: 0 } as any)
  return payload.create({ collection, data, depth: 0 } as any)
}

const uploadOnce = async (file: string, alt: string): Promise<number> => {
  const filename = path.basename(file)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0].id
  const data = fs.readFileSync(file)
  const mimetype = filename.endsWith('.png') ? 'image/png' : 'image/webp'
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
  })
  return doc.id
}

const textNode = (text: string) => ({
  type: 'text',
  version: 1,
  text,
  format: 0,
  mode: 'normal',
  style: '',
  detail: 0,
})
const element = (type: string, children: any[], extra: any = {}) => ({
  type,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children,
  ...extra,
})
const para = (children: any[]) => element('paragraph', children, { textFormat: 0, textStyle: '' })
const list = (items: string[], tag: 'ul' | 'ol') =>
  element(
    'list',
    items.map((item, index) => element('listitem', [textNode(item)], { value: index + 1 })),
    { listType: tag === 'ul' ? 'bullet' : 'number', tag, start: 1 },
  )


const toLexical = (blocks: Block[]) => ({
  root: element(
    'root',
    blocks.flatMap((block): any[] => {
      if ('h2' in block) return [element('heading', [textNode(block.h2)], { tag: 'h2' })]
      if ('h3' in block) return [element('heading', [textNode(block.h3)], { tag: 'h3' })]
      if ('ul' in block) return [list(block.ul, 'ul')]
      if ('ol' in block) return [list(block.ol, 'ol')]
      if ('photo' in block) {
        return [{ type: 'block', version: 2, format: '', fields: { id: block.photo.src, blockName: '', blockType: 'photo', ...block.photo } }]
      }
      if ('facts' in block) {
        return [{ type: 'block', version: 2, format: '', fields: { id: `facts-${block.facts.name}`, blockName: '', blockType: 'facts', ...block.facts, note: block.facts.note ?? REVIEW_NOTE } }]
      }
      if ('compare' in block) {
        const { caption, columns, rows } = block.compare
        return [
          {
            type: 'block',
            version: 2,
            format: '',
            fields: {
              id: `compare-${caption}`,
              blockName: '',
              blockType: 'compare',
              caption,
              columns: columns.map((label) => ({ label })),
              rows: rows.map((row) => ({ label: row.label, cells: row.cells.map((value) => ({ value })) })),
            },
          },
        ]
      }
      if ('cta' in block) {
        const { link, ...fields } = block.cta
        const url = issued[link]?.url
        if (!url) {
          console.log('drop cta, no link yet:', link)
          return []
        }
        return [
          {
            type: 'block',
            version: 2,
            format: '',
            fields: {
              id: link,
              blockName: '',
              blockType: 'cta',
              ...fields,
              url,
              image: publicFile(`/products/${link}.webp`) ?? null,
            },
          },
        ]
      }
      if (typeof block.p === 'string') return [para([textNode(block.p)])]
      return [
        para(
          block.p.map((part) => {
            if (typeof part === 'string') return textNode(part)
            const url = issued[part.link]?.url
            // Plain text until the daily issuing quota reaches this link; re-seeding turns it into a link.
            if (!url) return textNode(part.text)
            return element('link', [textNode(part.text)], { fields: { linkType: 'custom', url, newTab: true } })
          }),
        ),
      ]
    }),
  ),
})

const linkIds: Record<string, number> = {}
for (const [slug, link] of Object.entries(issued)) {
  if (!link.url) continue
  const saved = await upsert(
    'affiliate-links',
    { slug: { equals: slug } },
    { name: link.title ?? slug, slug, partner: link.program ?? '', url: link.url, landingUrl: link.landing },
  )
  linkIds[slug] = saved.id
}
console.log('links', Object.keys(linkIds).length)

const media: Record<string, number> = {}
const reviewPhotos = [...blog, ...reviews].map((post) => [post.hero, post.title] as const)
for (const [name, alt] of [...Object.entries(photos), ...reviewPhotos]) {
  if (media[name]) continue
  media[name] = await uploadOnce(path.join(PHOTO_DIR, `${name}.webp`), alt)
  // The post page finds this twin by file name and offers it to wide and high-density screens.
  const twin = path.join(PHOTO_DIR, `${name}@2x.webp`)
  if (fs.existsSync(twin)) await uploadOnce(twin, alt)
}
console.log('photos', Object.keys(media).length)

const categoryIds: Record<string, number> = {}
for (const item of categories) {
  categoryIds[item.slug] = (await upsert('categories', { slug: { equals: item.slug } }, item)).id
}

const partnerIds: Record<string, number> = {}
for (const [order, item] of partners.entries()) {
  const { link, logoOf, ...rest } = item
  if (!linkIds[link]) {
    console.log('skip partner, no link:', item.slug)
    continue
  }
  const data = {
    ...rest,
    order,
    link: linkIds[link],
    logo: logos[logoOf] ? publicFile(`/logos/${logos[logoOf]}`) : undefined,
  }
  partnerIds[item.slug] = (await upsert('partners', { slug: { equals: item.slug } }, data)).id
}
console.log('partners', Object.keys(partnerIds).length)

const dealIds: Record<string, number> = {}
for (const deal of deals) {
  const { partner, link, image, ...rest } = deal
  const partnerId = partnerIds[partner]
  if (!partnerId || !linkIds[link]) throw new Error(`deal ${deal.title}: missing partner or link ${link}`)
  const saved = await upsert(
    'deals',
    { and: [{ partner: { equals: partnerId } }, { title: { equals: deal.title } }] },
    {
      ...rest,
      partner: partnerId,
      affiliateLink: linkIds[link],
      image: image ? publicFile(`/deals/${image}.webp`) : undefined,
      verifiedAt: VERIFIED,
    },
  )
  // Posts name a deal by its code, or by title or partner name when it has no code.
  for (const key of [deal.code, deal.title, partners.find((p) => p.slug === partner)?.name]) {
    if (key && !(key in dealIds)) dealIds[key] = saved.id
  }
}
console.log('deals', deals.length)

const KIND_LABELS: [string, 'hotel' | 'flight' | 'tour', string][] = [
  ['hotelYeogi', 'hotel', '숙소 특가 보기'],
  ['hotelAgoda', 'hotel', '호텔 보기'],
  ['hotelTrip', 'hotel', '트립닷컴 호텔'],
  ['flightTrip', 'flight', '항공권 보기'],
  ['flightTtang', 'flight', '땡처리 항공권'],
  ['tourKlook', 'tour', '클룩 투어'],
  ['tourKkday', 'tour', 'KKday 투어'],
]
const PARTNER_NAMES: Record<string, string> = { klook: '클룩', kkday: 'KKday', tripcom: '트립닷컴', agoda: '아고다', yeogi: '여기어때' }
let productCount = 0
for (const [order, entry] of Object.values(catalog).entries()) {
  const copy = destinations[entry.slug]
  if (!copy) throw new Error(`no copy for destination ${entry.slug}`)
  const links = KIND_LABELS.flatMap(([key, kind, label]) => {
    const id = linkIds[entry.links[key]]
    return id ? [{ kind, label, link: id }] : []
  })
  // The studio issues about 50 links a day: a city appears once at least one of its links exists.
  if (!links.length && !entry.products.some((product) => linkIds[product.slug])) {
    console.log('skip destination, no links yet:', entry.slug)
    continue
  }
  const saved = await upsert(
    'destinations',
    { slug: { equals: entry.slug } },
    {
      name: entry.name,
      slug: entry.slug,
      country: copy.country,
      lede: copy.lede,
      photo: `/photos/${entry.slug}.webp`,
      photoAlt: copy.alt,
      order,
      links,
    },
  )
  for (const [index, product] of entry.products.entries()) {
    const link = linkIds[product.slug]
    if (!link) continue
    await upsert(
      'products',
      { slug: { equals: product.slug } },
      {
        name: product.title,
        slug: product.slug,
        partner: PARTNER_NAMES[product.partner] ?? product.partner,
        destination: saved.id,
        image: publicFile(`/products/${product.slug}.webp`) ?? `/photos/${entry.slug}.webp`,
        featured: featuredProducts.includes(product.slug),
        order: featuredProducts.includes(product.slug) ? featuredProducts.indexOf(product.slug) : 100 + index,
        link,
      },
    )
    productCount += 1
  }
}
console.log('destinations', Object.keys(catalog).length, 'products', productCount)

for (const page of pages) {
  const { body, ...rest } = page
  await upsert('pages', { slug: { equals: page.slug } }, { ...rest, content: toLexical(body as Block[]) })
}
console.log('pages', pages.length)

await payload.updateGlobal({ slug: 'navigation', data: navigation })

const postIds: Record<string, number> = {}
for (const [index, post] of posts.entries()) {
  const ogFile = path.join(OG_DIR, `${post.slug}.png`)
  const ogImage = fs.existsSync(ogFile) ? await uploadOnce(ogFile, `${post.title} 공유 썸네일`) : undefined
  const saved = await upsert(
    'posts',
    { slug: { equals: post.slug } },
    {
      title: post.title,
      slug: post.slug,
      // The coined term has to appear in the title and opening for Naver to tie it to this page.
      metaTitle: coined[post.slug] ? `${post.title} | ${coined[post.slug]}` : undefined,
      summary: post.summary,
      category: categoryIds[post.category],
      heroImage: media[post.hero],
      ogImage,
      content: toLexical(
        coined[post.slug]
          ? [{ p: `📌 네이버에서 ${coined[post.slug]}를 검색하면 이 글을 다시 찾을 수 있습니다.` }, ...post.body]
          : post.body,
      ),
      deals: post.deals.map((key) => {
        if (!dealIds[key]) throw new Error(`post ${post.slug}: unknown deal ${key}`)
        return dealIds[key]
      }),
      verifiedAt: blogSlugs.has(post.slug) ? BLOG_VERIFIED : reviewSlugs.has(post.slug) ? REVIEW_VERIFIED : VERIFIED,
      // Spaced by a minute so the newest-first list keeps the planned order.
      publishedAt: new Date(Date.parse(VERIFIED) - index * 60_000).toISOString(),
      _status: 'published',
    },
  )
  postIds[post.slug] = saved.id
}
for (const post of posts) {
  await payload.update({
    collection: 'posts',
    id: postIds[post.slug],
    data: { relatedPosts: post.related.map((slug) => postIds[slug]), _status: 'published' },
    depth: 0,
  })
}
console.log('posts', posts.length)
process.exit(0)
