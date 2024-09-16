/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'apps/evm/api/**',
    'packages/currency/src/constants.ts',
    'packages/sats-wagmi/package.json',
    '.storybook/vite.config.ts'
  ]
};

export default config;
