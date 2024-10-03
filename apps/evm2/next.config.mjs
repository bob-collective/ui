import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      },
      {
        source: '/gateway-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_GATEWAY_API_URL}/:path*`
      },
      {
        source: '/btc-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BTC_API_URL}/:path*`
      }
    ];
  },
  // reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'encoding');

    return config;
  }
};

export default withSentryConfig(withNextIntl(nextConfig), {
  hideSourceMaps: true
});
