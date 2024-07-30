/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: ['apps/evm/src/pages/Home/**', 'apps/evm/api/**', 'apps/bob-pay/api/**', 'packages/currency/src/constants.ts']
};

export default config;
