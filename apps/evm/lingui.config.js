/** @type {import('@lingui/conf').LinguiConfig} */
const config = {
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  },
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src/']
    }
  ]
};

export default config;
