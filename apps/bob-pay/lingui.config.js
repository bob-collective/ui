import linguiConfig from '../../lingui.config';

const config = {
  ...linguiConfig,
  catalogs: [
    {
      path: '../../locales/{locale}',
      include: ['src/', '../evm/src/']
    }
  ]
};

export default config;
