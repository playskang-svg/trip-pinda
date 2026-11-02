import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import React from 'react'

import { SiteHeader } from '@/components/SiteHeader'
import { DISCLOSURE, getClient, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/payload'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: [
    SITE_NAME,
    '여행할인정보센터',
    '호텔 할인코드',
    '아고다 할인코드',
    '트립닷컴 할인코드',
    '호텔스닷컴 할인코드',
    '익스피디아 할인코드',
    '호텔 할인쿠폰',
    '호텔 최저가 예약',
    '일본 호텔 예약',
    '동남아 리조트 특가',
    '항공권 특가',
    '땡처리 항공권',
    '스카이스캐너 특가',
    '해외 항공권 예약',
    '해외여행 이심 할인',
    '일본 이심 eSIM 추천',
    '베트남 유심',
    '도시락유심 할인',
    '로밍도깨비 할인코드',
    '투어 티켓 할인',
    '클룩 할인코드',
    '클룩 할인쿠폰',
    '마이리얼트립 할인쿠폰',
    'USJ 익스프레스 티켓',
    '도쿄 디즈니랜드 입장권',
    '시부야 스카이 예약',
    '바나힐 입장권',
    '일본 JR패스',
    '간사이 쓰루패스',
    '공항철도 직통열차',
    '렌터카 할인',
    '여행경비 절약',
    '12월 해외여행지 추천',
    '1월 해외여행지 추천',
    '아이랑 해외여행',
    '비짓재팬웹 등록방법',
    '베트남 전자비자',
    '중국 무비자 여행',
    '트래블월렛 트래블로그 비교',
    '해외여행자보험 비교',
    '오사카 여행 코스',
    '도쿄 여행 코스',
    '후쿠오카 여행 경비',
    '다낭 가족여행',
    '방콕 자유여행',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  // Prices must not turn into phone links on mobile browsers.
  formatDetection: { telephone: false },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
  alternates: {
    types: { 'application/rss+xml': '/rss.xml' },
  },
  verification: {
    other: { 'naver-site-verification': 'b05ef30d065548854031f53f4f23b38102586afa' },
  },
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// Menus live in D1, which is empty during the build.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getClient()
  const nav = await payload.findGlobal({ slug: 'navigation' })

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://trip.pinda.kr/#website',
                  url: 'https://trip.pinda.kr',
                  name: SITE_NAME,
                  alternateName: '여행할인정보센터',
                  description: '호텔·항공권·투어·렌터카·이심 공식 프로모션 코드 및 할인 정보',
                  inLanguage: 'ko-KR',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://trip.pinda.kr/search?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://trip.pinda.kr/#organization',
                  name: SITE_NAME,
                  url: 'https://trip.pinda.kr',
                  logo: 'https://trip.pinda.kr/og-default.png',
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">
          본문 바로가기
        </a>
        <SiteHeader items={nav.header ?? []} siteName={SITE_NAME} />
        {/* Partners withhold commission from content without this notice, so every page carries it. */}
        <p className="ad-note">{DISCLOSURE}</p>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="frame">
            <div className="site-footer__row">
              <strong>{SITE_NAME}</strong>
              <nav aria-label="하단 메뉴" className="site-footer__nav">
                {nav.footer?.map((item) => (
                  <Link href={item.url} key={item.id ?? item.url}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <span>© {new Date().getFullYear()} trip.pinda.kr</span>
            </div>
            <p className="site-footer__note">
              여행 할인 정보를 정리하는 개인 운영 사이트로, 각 여행 서비스와 무관합니다. 예약과 환불은 예약한 플랫폼이
              처리합니다. 가격과 혜택은 바뀔 수 있으니 결제 화면에서 확인해 주세요.
            </p>
          </div>
        </footer>
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
