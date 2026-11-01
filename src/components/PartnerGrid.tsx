import { AffiliateAnchor } from '@/components/AffiliateAnchor'
import type { Partner } from '@/payload-types'

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <ul className="partners">
      {partners.map((partner) => (
        <li key={partner.id}>
          <AffiliateAnchor link={partner.link}>
            {partner.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" height={48} loading="lazy" src={partner.logo} width={48} />
            ) : null}
            <strong>{partner.name}</strong>
            <span>{partner.blurb}</span>
          </AffiliateAnchor>
        </li>
      ))}
    </ul>
  )
}
