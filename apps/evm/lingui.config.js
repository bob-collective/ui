import linguiConfig from '../../lingui.config';

const config = {
  ...linguiConfig,
  catalogs: [
    {
      path: '../../locales/{locale}',
      include: ['src/', '../bob-pay/src/']
    }
  ]
};

export default config;
