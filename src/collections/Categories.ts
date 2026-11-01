import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: '카테고리', plural: '카테고리' },
  admin: { useAsTitle: 'title', group: '콘텐츠' },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '이름', type: 'text', required: true },
    { name: 'slug', label: '주소', type: 'text', required: true, unique: true, index: true },
    { name: 'lede', label: '소개', type: 'textarea', required: true },
    { name: 'photo', label: '사진 경로', type: 'text', required: true },
    { name: 'photoAlt', label: '사진 설명', type: 'text', required: true },
    { name: 'order', label: '순서', type: 'number', defaultValue: 100 },
  ],
}
