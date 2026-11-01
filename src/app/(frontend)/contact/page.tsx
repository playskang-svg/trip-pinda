import type { Metadata } from 'next'

import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: '문의 안내',
  description: '예약, 결제, 환불, 쿠폰 문제는 예약한 플랫폼의 고객센터에서 처리합니다.',
  path: '/contact',
})

const CENTERS = [
  { name: '클룩 도움말', url: 'https://www.klook.com/ko/help-center/' },
  { name: '트립닷컴 고객센터', url: 'https://kr.trip.com/customer-support/' },
  { name: '아고다 도움말', url: 'https://www.agoda.com/ko-kr/info/agoda-faq.html' },
  { name: 'KKday 고객센터', url: 'https://www.kkday.com/ko/help' },
  { name: '트래블로카 도움말', url: 'https://www.traveloka.com/ko-kr/help' },
  { name: '유심사 고객센터', url: 'https://www.usimsa.com/' },
]

export default function ContactPage() {
  return (
    <section className="section page-head">
      <div className="frame frame--text">
        <h1>문의 안내</h1>
        <p className="lede">
          이 사이트는 할인 정보를 정리해 보여 드리는 곳이라 예약과 결제를 다루지 않습니다. 예약, 환불, 쿠폰 적용 문제는
          예약한 플랫폼의 고객센터에서 바로 처리됩니다.
        </p>
        <ul className="half-features">
          {CENTERS.map((c) => (
            <li key={c.url}>
              <a href={c.url} rel="noopener" target="_blank">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
