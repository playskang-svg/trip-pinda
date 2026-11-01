import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'

export const AffiliateLinks: CollectionConfig = {
  slug: 'affiliate-links',
  labels: { singular: '제휴 링크', plural: '제휴 링크' },
  admin: {
    useAsTitle: 'name',
    group: '제휴',
    defaultColumns: ['name', 'partner', 'url', 'landingUrl'],
    description: '클릭 수는 세시간전 스튜디오의 내 제휴링크에서 봅니다.',
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  fields: [
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'slug', label: '식별자', type: 'text', required: true, unique: true, index: true },
    { name: 'partner', label: '제휴사', type: 'text', required: true },
    { name: 'url', label: '세시간전 제휴 URL', type: 'text', required: true },
    {
      name: 'landingUrl',
      label: '도착 페이지',
      type: 'text',
      required: true,
      admin: { description: '이 링크를 발급할 때 넣은 원래 주소입니다.' },
    },
  ],
}
