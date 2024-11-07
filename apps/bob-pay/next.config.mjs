/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  experimental: {
    // optimizePackageImports: ['@dynamic-labs/sdk-react-core'],
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
        source: '/bob-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      },
      {
        source: '/dynamic-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_DYNAMIC_API_URL}/:path*`
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

export default nextConfig;
