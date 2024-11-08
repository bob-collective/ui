/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  },
  // catalogs: [
  //   {
  //     path: 'locales/{locale}',
  //     include: ['apps/evm/src', 'apps/bob-pay/src']
  //   }
  // ],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}',
      include: ['<rootDir>/apps/evm/src', '<rootDir>/apps/bob-pay/src']
    }
  ]
};
