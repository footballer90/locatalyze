import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.mapbox.com' },
      { protocol: 'https', hostname: 'events.mapbox.com' },
    ],
  },
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*',        destination: 'https://us.i.posthog.com/:path*' },
    ]
  },
  async redirects() {
    return [
      { source: '/sydney',     destination: '/analyse/sydney',     permanent: true },
      { source: '/perth',      destination: '/analyse/perth',      permanent: true },
      { source: '/melbourne',  destination: '/analyse/melbourne',  permanent: true },
      { source: '/brisbane',   destination: '/analyse/brisbane',   permanent: true },
      { source: '/adelaide',   destination: '/analyse/adelaide',   permanent: true },
      { source: '/gold-coast', destination: '/analyse/gold-coast', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://fonts.googleapis.com https://plausible.io https://www.googletagmanager.com https://api.mapbox.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: https://*.mapbox.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://challenges.cloudflare.com https://*.upstash.io https://plausible.io https://api.mapbox.com https://events.mapbox.com https://us1.locationiq.com https://api.locationiq.com https://nominatim.openstreetmap.org https://api.geoapify.com https://*.ingest.sentry.io https://*.sentry.io",
              "worker-src blob:",
              "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

// Wrap with Sentry only if the package is installed (graceful degradation)
function applyOptionalSentry(config: NextConfig): NextConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { withSentryConfig } = require('@sentry/nextjs')
    return withSentryConfig(config, {
      org: 'locatalyze',
      project: 'javascript-nextjs',
      silent: !process.env.CI,
      widenClientFileUpload: true,
    })
  } catch {
    return config
  }
}

export default applyOptionalSentry(nextConfig)