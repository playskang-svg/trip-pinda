import { AffiliateAnchor } from '@/components/AffiliateAnchor'
import { retina } from '@/lib/images'
import type { Destination } from '@/payload-types'

// One photo card per city that opens that city's page at the partner, used on the hotel and flight category pages.
export function DestinationLinks({ destinations, kind }: { destinations: Destination[]; kind: 'hotel' | 'flight' }) {
  const noun = kind === 'hotel' ? '호텔' : '항공권'
  return (
    <ul className="destinations">
      {destinations.map((item) => {
        const entry = item.links?.find((link) => link.kind === kind)
        if (!entry) return null
        return (
          <li key={item.id}>
            <AffiliateAnchor link={entry.link}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={item.photoAlt} height={400} loading="lazy" src={item.photo} srcSet={retina(item.photo)} width={640} />
              <span>
                <small>{kind === 'flight' ? '서울 출발' : item.country}</small>
                <strong>
                  {item.name} {noun}
                </strong>
              </span>
            </AffiliateAnchor>
          </li>
        )
      })}
    </ul>
  )
}
