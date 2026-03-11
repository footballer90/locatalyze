import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',       value: 'on' },
          { key: 'X-Frame-Options',               value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',         value: 'nosniff' },
          { key: 'Referrer-Policy',               value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',            value: 'camera=(), microphone=(), geolocation=()' },
          // Fixes PageSpeed HSTS warning
          { key: 'Strict-Transport-Security',     value: 'max-age=63072000; includeSubDomains; preload' },
          // Fixes PageSpeed COOP warning
          { key: 'Cross-Origin-Opener-Policy',    value: 'same-origin-allow-popups' },
        ],
      },
    ]
  },
}

export default nextConfig