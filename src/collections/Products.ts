import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '여행 상품', plural: '여행 상품' },
  admin: { useAsTitle: 'name', group: '여행 데이터', defaultColumns: ['name', 'partner', 'destination', 'order'] },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: '상품 이름', type: 'text', required: true },
    { name: 'slug', label: '식별자', type: 'text', required: true, unique: true, index: true },
    { name: 'partner', label: '판매처', type: 'text', required: true },
    { name: 'destination', label: '여행지', type: 'relationship', relationTo: 'destinations', required: true, index: true },
    { name: 'image', label: '사진 경로', type: 'text' },
    { name: 'featured', label: '홈에 표시', type: 'checkbox', defaultValue: false, index: true },
    { name: 'order', label: '순서', type: 'number', defaultValue: 100 },
    { name: 'link', label: '제휴 링크', type: 'relationship', relationTo: 'affiliate-links', required: true },
  ],
}
