/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  },
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}',
      include: ['<rootDir>/apps/evm/src', '<rootDir>/apps/bob-pay/src']
    }
  ]
};
