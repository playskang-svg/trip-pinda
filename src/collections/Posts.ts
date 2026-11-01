import type { Access, CollectionConfig } from 'payload'

import { signedIn } from './access'

const publishedOnly: Access = ({ req }) => {
  if (req.user) return true
  return {
    and: [
      { _status: { equals: 'published' } },
      { publishedAt: { less_than_equal: new Date().toISOString() } },
    ],
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: '글', plural: '글' },
  admin: {
    useAsTitle: 'title',
    group: '콘텐츠',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  // A future publish date acts as scheduling; Workers have no job runner for schedulePublish.
  versions: { drafts: true },
  access: { read: publishedOnly, create: signedIn, update: signedIn, delete: signedIn },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: '제목', type: 'text', required: true },
    {
      name: 'slug',
      label: '주소',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: '영문 소문자와 하이픈. 예: chatgpt-pricing' },
    },
    {
      name: 'publishedAt',
      label: '공개 시각',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: '미래 시각으로 발행하면 그 시각에 공개됩니다(예약 발행).',
      },
    },
    {
      name: 'category',
      label: '카테고리',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'verifiedAt',
      label: '정보 확인일',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'metaTitle',
      label: '검색 제목',
      type: 'text',
      admin: { position: 'sidebar', description: '비우면 글 제목을 씁니다.' },
    },
    {
      name: 'summary',
      label: '핵심 한 줄 요약',
      type: 'textarea',
      required: true,
      admin: { description: '글 맨 위 요약 상자와 검색 설명에 함께 쓰입니다.' },
    },
    { name: 'heroImage', label: '대표 사진', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'ogImage',
      label: '공유 썸네일 (1200×630)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '비워 두면 사이트 기본 썸네일을 씁니다.' },
    },
    { name: 'content', label: '본문', type: 'richText', required: true },
    {
      name: 'deals',
      label: '글에 넣을 할인',
      type: 'relationship',
      relationTo: 'deals',
      hasMany: true,
      admin: {
        description: '본문 앞과 끝에 코드·예약 버튼으로 들어갑니다. 수익률 상향 클룩 글에는 클룩 할인만 넣습니다.',
      },
    },
    {
      name: 'relatedPosts',
      label: '함께 볼 글',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxDepth: 2,
    },
    {
      name: 'sources',
      label: '공식 출처',
      type: 'array',
      fields: [
        { name: 'label', label: '이름', type: 'text', required: true },
        { name: 'url', label: '주소', type: 'text', required: true },
      ],
    },
  ],
}
