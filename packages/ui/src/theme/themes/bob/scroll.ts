import { ScrollTheme } from '../../components';

import { color } from './colors';

const scroll: ScrollTheme = {
  base: {
    width: '14px',
    height: '18px'
  },
  thumb: {
    height: '30px',
    border: '4px solid rgba(255, 255, 255, 0)',
    backgroundColor: color('grey-800'),
    '-webkit-border-radius': '7px',
    '-webkit-box-shadow': `inset -1px -1px 0px rgba(0, 0, 0, 0.05),
      inset 1px 1px 0px rgba(0, 0, 0, 0.05)`,
    backgroundClip: 'padding-box'
  },
  button: {
    display: 'none',
    width: 0,
    height: 0
  },
  corner: {
    backgroundColor: 'transparent'
  }
};

export { scroll };
