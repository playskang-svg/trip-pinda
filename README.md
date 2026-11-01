# 여행할인 정보센터 (trip.pinda.kr)

Payload CMS + Next.js on Cloudflare Workers (D1, R2). Affiliate links come from the 3hoursahead studio (AID 136206).

## Deploy

Windows builds of OpenNext fail at runtime, so GitHub Actions builds on Linux.

1. `git push`, then wait for the Build workflow.
2. `pnpm deploy:ci`

After changing a collection: `pnpm payload migrate:create`, then `NODE_ENV=production pnpm payload migrate`.

## Content rules that affect payouts

- No page, post or category title may contain 여기어때 or 찜카. Those programs withhold commission otherwise.
- Every page shows the ad notice in the layout. 여기어때 withholds commission without it.
- Klook-only pages (Paris, Rome, Barcelona and the Klook coupon posts) carry only Klook links: the raised Klook rates forbid other partners' links in the same content.
- A code and its link always point at the same partner. Most codes only work when the visitor arrives through a 3ha.in link.

## Checks

- `node scripts/verify-links.mjs` follows each issued link and confirms the partner and AID.
- `pnpm test` covers deal expiry.

Public pages are cached at the edge for 5 minutes in `custom-worker.ts`, so admin edits can take that long to appear.
