import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // next dev would otherwise write AGENTS.md and CLAUDE.md into the repo.
  agentRules: false,
  outputFileTracingExcludes: { '*': ['**/sharp/**', '**/@img/**'] },
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Scoped to this site: the zone-wide "Always Use HTTPS" switch would also touch other pinda.kr subdomains.
  // OpenNext tests `value` unanchored, so ^http$ keeps it from matching "https"; `/:path*` leaves the root unsubstituted.
  redirects: async () => {
    const has = [
      { type: 'host' as const, value: 'trip.pinda.kr' },
      { type: 'header' as const, key: 'x-forwarded-proto', value: '^http$' },
    ]
    return [
      { source: '/', has, destination: 'https://trip.pinda.kr/', permanent: true },
      { source: '/:path+', has, destination: 'https://trip.pinda.kr/:path+', permanent: true },
    ]
  },

  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
