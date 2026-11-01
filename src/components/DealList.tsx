import { AffiliateAnchor } from '@/components/AffiliateAnchor'
import { CopyCode } from '@/components/CopyCode'
import { formatDate } from '@/lib/pricing'
import type { Deal } from '@/payload-types'

const SOON_DAYS = 14

const ctaLabel = (deal: Deal, partner: string) => {
  if (deal.code) return `${partner}에서 코드 쓰기`
  return deal.type === 'auto' ? `${partner}에서 할인받기` : `${partner} 특가 보기`
}

// The whole card opens the deal; only the copy button stays separate so a code can be copied first.
export function DealList({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) return <p>지금 확인된 할인이 없습니다.</p>
  const now = Date.now()
  return (
    <ul className="deals">
      {deals.map((deal) => {
        const partner = typeof deal.partner === 'object' ? deal.partner : null
        const name = partner?.name ?? ''
        const left = deal.endsAt ? (new Date(deal.endsAt).getTime() - now) / 86_400_000 : null
        return (
          <li className="deal" key={deal.id}>
            {deal.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="deal__image" height={300} loading="lazy" src={deal.image} width={600} />
            ) : null}
            <div className="deal__body">
              <div className="deal__partner">
                {partner?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" height={24} loading="lazy" src={partner.logo} width={24} />
                ) : null}
                <small>{name}</small>
              </div>
              <p className="deals__benefit">{deal.benefit}</p>
              <h3>
                <AffiliateAnchor className="deal__link" link={deal.affiliateLink}>
                  {deal.title}
                </AffiliateAnchor>
              </h3>
              {deal.code ? <CopyCode code={deal.code} /> : null}
              <p>{deal.conditions}</p>
              <p className="deals__end">
                {deal.endsAt ? `${formatDate(deal.endsAt)}까지` : '상시 진행'}
                {left !== null && left <= SOON_DAYS ? <strong> 곧 종료</strong> : null}
              </p>
              <span aria-hidden="true" className="button button--go">
                {ctaLabel(deal, name)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
