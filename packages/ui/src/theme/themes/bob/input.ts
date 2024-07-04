import { InputTheme } from '../../components';

import { color } from './colors';

const input: InputTheme = {
  base: {
    color: color('light'),
    backgroundColor: color('grey-700'),
    borderColor: 'transparent'
  },
  hover: {
    borderColor: color('grey-300')
  },
  focus: {
    borderColor: color('light'),
    boxShadow: `0 0 0 1px ${color('light')}`
  },
  placeholder: {
    color: color('grey-50')
  },
  disabled: {
    opacity: 0.5
  },
  error: {
    base: {
      borderColor: color('red-500'),
      color: color('red-500')
    },
    hover: {
      borderColor: color('red-500')
    },
    focus: {
      boxShadow: `0 0 0 1px ${color('red-500')}`
    }
  },
  adornment: {
    color: color('grey-300')
  }
};

export { input };
