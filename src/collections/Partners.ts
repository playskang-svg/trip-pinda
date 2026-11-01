import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'
import { TRAVEL_CATEGORIES } from './options'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: '여행 서비스', plural: '여행 서비스' },
  admin: { useAsTitle: 'name', group: '여행 데이터', defaultColumns: ['name', 'categories', 'order'] },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'slug', label: '식별자', type: 'text', required: true, unique: true, index: true },
    {
      name: 'categories',
      label: '분야',
      type: 'select',
      hasMany: true,
      required: true,
      options: [...TRAVEL_CATEGORIES],
    },
    { name: 'blurb', label: '한 줄 소개', type: 'text', required: true },
    { name: 'logo', label: '로고 경로', type: 'text' },
    { name: 'order', label: '순서', type: 'number', defaultValue: 100 },
    {
      name: 'link',
      label: '기본 제휴 링크',
      type: 'relationship',
      relationTo: 'affiliate-links',
      required: true,
    },
  ],
}
