/** @type {import('knip').KnipConfig} */
const config = {
  ignoreWorkspaces: ['apps/e2e'],
  ignoreBinaries: ['synpress:run'],
  ignore: [
    'lingui.config.js',
    'apps/bob-pay/api/**',
    'apps/bob-pay/src/i18n/**',
    'apps/evm/api/**',
    'apps/evm/src/i18n/**',
    'apps/evm/src/connect-ui/**',
    'packages/currency/src/constants.ts',
    'packages/sats-wagmi/package.json',
    '.storybook/vite.config.ts'
  ],
  ignoreDependencies: [
    '@lingui/swc-plugin',
    '@lingui/loader',
    'sharp',
    'vite-plugin-node-polyfills',
    'vite-plugin-wasm'
  ]
};

export default config;
