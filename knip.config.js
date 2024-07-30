/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'apps/evm/src/pages/Home/**',
    'apps/evm/api/**',
    'packages/currency/src/constants.ts',
    '.storybook/vite.config.ts',
    'apps/bob-pay/api/**'
  ]
};

export default config;
