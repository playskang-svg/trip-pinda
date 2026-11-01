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
