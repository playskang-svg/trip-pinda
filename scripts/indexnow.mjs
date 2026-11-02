// Tells Naver and Bing about every sitemap URL. The Naver console account is not needed, so run it by hand after a data push.
// Run: node scripts/indexnow.mjs
const SITE = 'https://trip.pinda.kr'
const KEY = 'da4ee8f017fb3f5a26698b8a377481d6'
const ENDPOINTS = ['https://searchadvisor.naver.com/indexnow', 'https://www.bing.com/indexnow']

const xml = await (await fetch(`${SITE}/sitemap.xml?v=${Date.now()}`)).text()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
console.log('urls', urlList.length)
for (const url of ENDPOINTS) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  })
  console.log(url, res.status)
}
