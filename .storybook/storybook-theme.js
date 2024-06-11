import { create } from '@storybook/theming';

import brandImage from './storybook-logo.svg';

export default create({
  base: 'dark',
  brandTitle: 'BOB UI',
  brandUrl: 'https://github.com/bob-collective/bob-ui',
  brandImage,
  colorPrimary: '#ff6301',
  colorSecondary: '#ff6301'
});
