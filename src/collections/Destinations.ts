import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: { singular: '여행지', plural: '여행지' },
  admin: { useAsTitle: 'name', group: '여행 데이터', defaultColumns: ['name', 'country', 'order'] },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'slug', label: '주소', type: 'text', required: true, unique: true, index: true },
    { name: 'country', label: '나라', type: 'text', required: true },
    { name: 'lede', label: '소개', type: 'textarea', required: true },
    { name: 'photo', label: '사진 경로', type: 'text', required: true },
    { name: 'photoAlt', label: '사진 설명', type: 'text', required: true },
    { name: 'order', label: '순서', type: 'number', defaultValue: 100 },
    {
      name: 'links',
      label: '바로가기',
      type: 'array',
      admin: { description: '유럽 도시처럼 클룩 상향 수익률을 받는 곳에는 클룩 링크만 넣습니다.' },
      fields: [
        {
          name: 'kind',
          label: '종류',
          type: 'select',
          required: true,
          options: [
            { label: '호텔', value: 'hotel' },
            { label: '항공권', value: 'flight' },
            { label: '투어', value: 'tour' },
          ],
        },
        { name: 'label', label: '버튼 이름', type: 'text', required: true },
        { name: 'link', label: '제휴 링크', type: 'relationship', relationTo: 'affiliate-links', required: true },
      ],
    },
  ],
}
