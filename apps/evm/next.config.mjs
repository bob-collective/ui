import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'] // Add the allowed hostname here
  },
  compiler: {
    styledComponents: true
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
    turbo: {
      rules: {
        '*.po': ['@lingui/loader']
      }
    }
  },
  rewrites() {
    return [
      {
        source: '/fusion-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_FUSION_API_URL}/:path*`
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_FUSION_API_URL}/:path*`
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
  webpack: (config) => {
    config.externals.push('pino-pretty', 'encoding');
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: '@lingui/loader'
      }
    });

    return config;
  }
};

export default withSentryConfig(nextConfig, {
  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
  release: {
    create: false
  }
});
