import { LinguiConfig } from '@lingui/conf';

import linguiConfig from '../../lingui.config';

const config = {
  ...linguiConfig,
  catalogs: [
    {
      path: '../../locales/{locale}',
      include: ['src/', '../evm/src/']
    }
  ]
} as const satisfies LinguiConfig;

export default config;
