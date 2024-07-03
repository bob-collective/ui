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
    borderColor: color('light')
  },
  placeholder: {
    color: color('grey-50')
  },
  disabled: {
    opacity: 0.5
  },
  error: {
    base: {
      borderColor: color('red-500')
    },
    hover: {
      borderColor: color('red-500')
    },
    focus: {
      borderColor: color('light')
    }
  },
  adornment: {
    color: color('grey-300')
  }
};

export { input };
