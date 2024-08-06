import { CardTheme } from '../../components';
import { transition } from '../../core';

import { color } from './colors';

const card: CardTheme = {
  base: {
    color: color('light'),
    boxShadow: '0px 1px 3px 0px #0000001a, 0px 1px 2px 0px #0000000f',
    backgroundColor: color('grey-400'),
    ...transition('common', 'normal')
  },
  active: {
    transform: 'scale(0.97)'
  },
  disabled: {
    opacity: 0.5
  }
};

export { card };
