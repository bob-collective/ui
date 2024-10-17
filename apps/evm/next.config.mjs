import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]]
  },
  rewrites() {
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
  hideSourceMaps: true
});
