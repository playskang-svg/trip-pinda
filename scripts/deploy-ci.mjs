// Downloads the Linux build of the latest successful run and deploys it with the local wrangler login.
import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'

const sh = (cmd) => execSync(cmd, { stdio: 'inherit' })
const repo = 'playskang-svg/trip-pinda'
// Tied to the checked-out commit: "latest successful run" lagged behind and redeployed an older build.
const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
const runId = execSync(
  `gh run list --repo ${repo} --workflow build.yml --commit ${sha} --status success --limit 1 --json databaseId --jq ".[0].databaseId"`,
  { encoding: 'utf8' },
).trim()
if (!runId) throw new Error(`no successful build run for ${sha}`)

rmSync('.open-next', { recursive: true, force: true })
rmSync('worker-dist', { recursive: true, force: true })
rmSync('open-next.tgz', { force: true })
sh(`gh run download ${runId} --repo ${repo} --name open-next --dir .`)
sh('tar --force-local -xzf open-next.tgz')
rmSync('open-next.tgz')
// Absolute Linux paths in the handler only resolve on the runner, so the runner bundles and this uploads as is.
// OPEN_NEXT_DEPLOY stops wrangler from handing off to opennextjs-cloudflare deploy, which would rebundle here.
execSync('pnpm exec wrangler deploy worker-dist/custom-worker.js --no-bundle', {
  stdio: 'inherit',
  env: { ...process.env, OPEN_NEXT_DEPLOY: 'true' },
})
console.log(`deployed run ${runId}`)
