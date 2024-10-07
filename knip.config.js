/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'apps/evm/api/**',
    'apps/evm2/api/**',
    'apps/evm2/src/i18n/**',
    'apps/evm2/sentry.ts',
    'packages/currency/src/constants.ts',
    'packages/sats-wagmi/package.json',
    '.storybook/vite.config.ts'
  ]
};

export default config;
