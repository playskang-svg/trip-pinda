import Link from 'next/link'

import type { Destination } from '@/payload-types'

export function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <ul className="destinations">
      {destinations.map((item) => (
        <li key={item.id}>
          <Link href={`/destinations/${item.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={item.photoAlt} height={400} loading="lazy" src={item.photo} width={640} />
            <span>
              <small>{item.country}</small>
              <strong>{item.name}</strong>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
