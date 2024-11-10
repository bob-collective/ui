import linguiConfig from '../../lingui.config';

export default config = {
  ...linguiConfig,
  catalogs: [
    {
      path: '../../locales/{locale}',
      include: ['src/', '../evm/src/']
    }
  ]
};
