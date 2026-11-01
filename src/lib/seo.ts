import type { Metadata } from 'next'

import { SITE_NAME, SITE_URL } from './payload'

const DEFAULT_IMAGE = '/og-default.png'

// Next replaces the parent's openGraph entirely, so every page has to restate these fields.
export const pageMeta = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  article,
}: {
  title: string
  description: string
  path: string
  image?: string
  article?: { publishedTime: string; modifiedTime: string; section?: string }
}): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'ko_KR',
    title,
    description,
    url: path,
    images: [{ url: image, width: 1200, height: 630 }],
    ...(article ? { type: 'article', ...article } : { type: 'website' }),
  },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
})

export const publisher = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
}
