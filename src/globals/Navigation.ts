import type { Field, GlobalConfig } from 'payload'

const links = (name: string, label: string): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'label', label: '이름', type: 'text', required: true },
    { name: 'url', label: '주소', type: 'text', required: true },
  ],
})

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '메뉴',
  admin: { group: '설정' },
  access: { read: () => true },
  fields: [links('header', '상단 메뉴'), links('footer', '하단 메뉴')],
}
