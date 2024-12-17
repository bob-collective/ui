import { LinguiConfig } from '@lingui/conf';

import linguiConfig from '../../lingui.config';

const config = {
  ...linguiConfig,
  catalogs: [
    {
      path: '../../locales/{locale}',
      include: ['src/', '../bob-pay/src/']
    }
  ]
} as const satisfies LinguiConfig;

export default config;
