import type { CollectionConfig } from 'payload'

import { anyone, signedIn } from './access'
import { TRAVEL_CATEGORIES } from './options'

export const Deals: CollectionConfig = {
  slug: 'deals',
  labels: { singular: '할인', plural: '할인' },
  admin: {
    useAsTitle: 'title',
    group: '여행 데이터',
    defaultColumns: ['title', 'partner', 'code', 'endsAt', 'verifiedAt'],
    description: '종료일이 지나면 화면에서 자동으로 빠집니다. 코드와 제휴 링크는 항상 같은 제휴사로 짝지어 넣습니다.',
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '할인 이름', type: 'text', required: true },
    { name: 'partner', label: '여행 서비스', type: 'relationship', relationTo: 'partners', required: true },
    { name: 'category', label: '분야', type: 'select', required: true, options: [...TRAVEL_CATEGORIES] },
    {
      name: 'type',
      label: '종류',
      type: 'select',
      required: true,
      defaultValue: 'code',
      index: true,
      options: [
        { label: '할인코드', value: 'code' },
        { label: '자동 할인', value: 'auto' },
        { label: '기획전·특가', value: 'event' },
      ],
    },
    { name: 'image', label: '쿠폰 이미지 경로', type: 'text' },
    {
      name: 'benefit',
      label: '혜택(크게 표시)',
      type: 'text',
      required: true,
      admin: { description: '예: 10% 할인, 최대 4만 원' },
    },
    {
      name: 'code',
      label: '할인 코드',
      type: 'text',
      admin: { description: '코드 없이 자동 적용되거나 이벤트 페이지면 비워 둡니다.' },
    },
    { name: 'conditions', label: '조건', type: 'textarea', required: true },
    {
      name: 'startsAt',
      label: '시작일',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'endsAt',
      label: '종료일',
      type: 'date',
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, description: '상시 진행이면 비워 둡니다.' },
    },
    {
      name: 'verifiedAt',
      label: '확인일',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'featured', label: '홈에 표시', type: 'checkbox', defaultValue: false },
    { name: 'order', label: '순서', type: 'number', defaultValue: 100 },
    {
      name: 'affiliateLink',
      label: '제휴 링크',
      type: 'relationship',
      relationTo: 'affiliate-links',
      required: true,
    },
  ],
}
