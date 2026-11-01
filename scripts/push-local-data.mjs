// Copies the seeded local D1 data and media to production. The remote proxy fails on long seeds, a single SQL file does not.
// Run after `pnpm payload run scripts/seed.ts`: node scripts/push-local-data.mjs
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const sh = (cmd) => execSync(cmd, { stdio: 'pipe', encoding: 'utf8' })
const wrangler = 'pnpm exec wrangler'
const dump = '.wrangler/data.sql'
const KEEP_REMOTE = /^INSERT INTO "?(payload_migrations|payload_preferences|payload_preferences_rels|payload_kv|users|users_sessions)"?[ (]/

sh(`${wrangler} d1 export trip-pinda --local --no-schema --output ${dump}`)
const lines = readFileSync(dump, 'utf8').split('\n')
const tables = new Set()
const kept = lines.filter((line) => {
  const match = line.match(/^INSERT INTO "?([a-z_0-9]+)"?[ (]/)
  if (!match) return !line.startsWith('PRAGMA') && line.trim() !== ''
  if (KEEP_REMOTE.test(line)) return false
  tables.add(match[1])
  return true
})
// D1 applies the file in batches, so deferred foreign keys do not help: parents have to come first.
const ORDER = ['categories', 'media', 'affiliate_links', 'partners', 'deals', 'destinations', 'products', 'pages', 'posts', '_posts_v', 'navigation']
const rank = (table) => {
  const index = ORDER.findIndex((name) => table === name)
  if (index >= 0) return index * 2
  // Child tables such as partners_categories or posts_rels follow their parent.
  const parent = ORDER.findIndex((name) => table.startsWith(`${name}_`))
  return parent >= 0 ? parent * 2 + 1 : ORDER.length * 2
}
const tableOf = (line) => line.match(/^INSERT INTO "?([a-z_0-9]+)"?[ (]/)?.[1] ?? ''
const inserts = kept.filter(tableOf).sort((a, b) => rank(tableOf(a)) - rank(tableOf(b)))
const body = [
  'PRAGMA defer_foreign_keys=TRUE;',
  ...[...tables].sort((a, b) => rank(b) - rank(a)).map((table) => `DELETE FROM "${table}";`),
  ...inserts,
].join('\n')
writeFileSync(dump, body)
console.log(sh(`${wrangler} d1 execute trip-pinda --remote --yes --file ${dump}`).split('\n').slice(-6).join('\n'))

const rows = JSON.parse(sh(`${wrangler} d1 execute trip-pinda --local --json --command "select filename from media"`))[0].results
for (const { filename } of rows) {
  const source = [`public/photos/${filename}`, `og/${filename}`].find(existsSync)
  if (!source) throw new Error(`no source file for ${filename}`)
  const type = filename.endsWith('.png') ? 'image/png' : 'image/webp'
  sh(`${wrangler} r2 object put trip-pinda-media/${filename} --file ${source} --content-type ${type} --remote`)
  console.log('r2', filename)
}
