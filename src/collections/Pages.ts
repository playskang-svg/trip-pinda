import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '안내 페이지', plural: '안내 페이지' },
  admin: { useAsTitle: 'title', group: '콘텐츠' },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  fields: [
    { name: 'title', label: '제목', type: 'text', required: true },
    { name: 'slug', label: '주소', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: '검색 설명', type: 'textarea' },
    { name: 'content', label: '본문', type: 'richText', required: true },
  ],
}
