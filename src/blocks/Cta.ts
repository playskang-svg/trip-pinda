import type { Block } from 'payload'

// Product call-to-action placed between paragraphs of a post.
export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: '상품 버튼', plural: '상품 버튼' },
  fields: [
    { name: 'hook', label: '후킹 문구', type: 'text', required: true },
    { name: 'name', label: '상품 이름', type: 'text', required: true },
    { name: 'button', label: '버튼 글자', type: 'text', required: true },
    { name: 'url', label: '제휴 URL', type: 'text', required: true },
    { name: 'image', label: '사진 경로', type: 'text' },
  ],
}

// Partner photo placed under the paragraph it illustrates.
export const PhotoBlock: Block = {
  slug: 'photo',
  labels: { singular: '사진', plural: '사진' },
  fields: [
    { name: 'src', label: '사진 경로', type: 'text', required: true },
    { name: 'alt', label: '사진 설명', type: 'text', required: true },
    { name: 'caption', label: '캡션', type: 'text', required: true },
  ],
}

// Rating and key facts at the top of a hotel review.
export const FactsBlock: Block = {
  slug: 'facts',
  labels: { singular: '호텔 요약', plural: '호텔 요약' },
  fields: [
    { name: 'name', label: '호텔 이름', type: 'text', required: true },
    { name: 'score', label: '평점', type: 'text', required: true },
    { name: 'count', label: '후기 수', type: 'text', required: true },
    { name: 'note', label: '안내 문구', type: 'text', required: true },
    {
      name: 'rows',
      label: '항목',
      type: 'array',
      fields: [
        { name: 'label', label: '이름', type: 'text', required: true },
        { name: 'value', label: '값', type: 'text', required: true },
      ],
    },
  ],
}
