/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'apps/evm/src/pages/Home/**',
    'apps/evm/api/**',
    'packages/currency/src/constants.ts',
    'apps/evm/vite.config.ts'
  ]
};

export default config;
