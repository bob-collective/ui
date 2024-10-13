/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'apps/evm/api/**',
    'apps/evm-next/api/**',
    'apps/evm-next/src/i18n/**',
    'apps/evm-next/sentry.ts',
    'packages/currency/src/constants.ts',
    'packages/sats-wagmi/package.json',
    '.storybook/vite.config.ts'
  ],
  ignoreDependencies: ['@lingui/swc-plugin', '@lingui/loader']
};

export default config;
