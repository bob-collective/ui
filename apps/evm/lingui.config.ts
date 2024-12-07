import { LinguiConfig } from '@lingui/conf';

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
} as const satisfies LinguiConfig;

export default config;
