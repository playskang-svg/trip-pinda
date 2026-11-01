import React from 'react'

import type { AffiliateLink } from '@/payload-types'

// Direct to 3ha.in: a click must still work when the Worker is over its CPU limit, and the studio counts clicks itself.
export function AffiliateAnchor({
  link,
  className,
  children,
}: {
  link: number | AffiliateLink
  className?: string
  children: React.ReactNode
}) {
  if (typeof link !== 'object') return null
  return (
    <a className={className} href={link.url} rel="sponsored nofollow noopener" target="_blank">
      {children}
    </a>
  )
}
