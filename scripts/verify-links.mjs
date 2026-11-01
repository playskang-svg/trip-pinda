// Follows every 3ha.in link one hop and checks it lands at the partner it was issued for, carrying this account's AID.
// Run: node scripts/verify-links.mjs   Exits 1 on any mismatch.
import { readFileSync } from 'node:fs'

const AID = '136206'
// Program id -> hosts its tracking redirect may start at.
const HOSTS = {
  agoda: ['agoda.com'],
  tripcom: ['trip.com'],
  klook: ['klook.com'],
  kkday: ['kkday.com'],
  yeogi: ['yeogi', 'onelink.me'],
  partnerize_traveloka: ['prf.hn', 'traveloka.com'],
  partnerize_hotelscom: ['hotels.com', 'prf.hn'],
  partnerize_expedia: ['expedia', 'prf.hn'],
  bookingcom: ['booking.com', 'awin', 'prf.hn'],
  linkprice_yanolja: ['linkprice.com'],
  linkprice_ttang: ['linkprice.com'],
  usimsa: ['usimsa.com'],
  impactcom_holafly: ['holafly', 'impact', 'sjv.io', 'pxf.io'],
  ebridge: ['theloungemembers.com', 'ebridge'],
  hanatour: ['hanatour.com'],
  stay_and_more: ['staynmore.com'],
  rakuten: ['rakuten'],
  minda: ['theminda.com'],
  tripstore: ['tripstore.kr'],
  zoomzoomtour: ['zoomzoomtour.com'],
  waug: ['waug.com'],
  tiqets: ['tiqets.com'],
  kayak: ['kayak'],
  kayak_hotelscombined: ['hotelscombined', 'kayak'],
  zzimcar: ['zzimcar'],
}

const links = JSON.parse(readFileSync('scripts/links.json', 'utf8'))
let bad = 0
let checked = 0
const entries = Object.entries(links).filter(([, link]) => link.url)
for (let i = 0; i < entries.length; i += 8) {
  await Promise.all(
    entries.slice(i, i + 8).map(async ([slug, link]) => {
      const res = await fetch(link.url, { redirect: 'manual', signal: AbortSignal.timeout(20000) }).catch((e) => ({ error: e.message }))
      const location = res.headers?.get('location') ?? ''
      const hosts = HOSTS[link.program] ?? []
      const hostOk = hosts.some((h) => location.includes(h))
      // Partner-specific redirects (onelink, partner pages) do not always expose the AID in the URL.
      const aidOk = location.includes(AID) || ['yeogi', 'usimsa', 'hanatour', 'ebridge'].includes(link.program)
      checked += 1
      if (!hostOk || !aidOk) {
        bad += 1
        console.log('MISMATCH', slug, link.url, res.status ?? res.error, location.slice(0, 110))
      }
    }),
  )
}
console.log(`checked ${checked}, mismatched ${bad}`)
process.exit(bad ? 1 : 0)
