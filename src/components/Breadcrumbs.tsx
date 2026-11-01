import Link from 'next/link'

import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/payload'

// Visible trail plus BreadcrumbList. The last item is the current page and takes no link.
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: '홈', path: '/' }, ...items]
  return (
    <>
      <JsonLd
        data={{
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`,
          })),
        }}
      />
      <nav aria-label="현재 위치" className="breadcrumbs">
        <ol>
          {trail.map((item, index) => (
            <li key={item.path}>
              {index === trail.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
