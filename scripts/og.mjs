// Renders share thumbnails with the snsogg skill: one per post (og/<slug>.png) plus the site default.
// Run: pnpm exec tsx scripts/og.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { blogPosts } from './seed-blog.ts'
import { trendPosts } from './seed-trends.ts'
import { categories, posts as guidePosts } from './seed-data.ts'

const reviews = JSON.parse(readFileSync('scripts/reviews.json', 'utf8'))
const posts = [...reviews, ...trendPosts, ...blogPosts, ...guidePosts]

const SKILL = 'C:/Window_DEV/.claude/skills/snsogg/render.mjs'
const { renderCard } = await import(pathToFileURL(SKILL).href)

const theme = {
  brand: '#ffffff',
  accent: '#ffc9a3',
  cta: '#d9480f',
}
const fontFiles = { 400: 'C:/Windows/Fonts/malgun.ttf', 700: 'C:/Windows/Fonts/malgunbd.ttf' }
const photo = (name) => `data:image/jpeg;base64,${readFileSync(`og/bg/${name}.jpg`).toString('base64')}`
const badge = (slug) => categories.find((c) => c.slug === slug)?.title

mkdirSync('og', { recursive: true })
for (const post of posts) {
  const png = await renderCard({
    layout: 'article',
    badge: badge(post.category),
    title: post.title,
    hook: post.hook,
    excerpt: post.summary,
    bgImage: photo(post.hero),
    footerText: 'trip.pinda.kr',
    cta: '할인코드 확인하기 →',
    theme,
    fontFiles,
  })
  writeFileSync(`og/${post.slug}.png`, png)
  console.log(post.slug, png.length)
}
const fallback = await renderCard({
  layout: 'article',
  badge: '호텔·항공·투어 할인',
  title: '결제 전에 코드부터 넣으세요',
  hook: '클룩, 트립닷컴, 트래블로카, KKday 할인코드를 조건과 기간까지 한곳에 모았습니다.',
  excerpt: '복사해서 바로 쓰는 여행 할인코드 모음',
  bgImage: photo('hero'),
  footerText: 'trip.pinda.kr',
  cta: '할인코드 보기 →',
  theme,
  fontFiles,
})
writeFileSync('public/og-default.png', fallback)
