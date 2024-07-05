import { InputTheme } from '../../components';

import { color } from './colors';

const input: InputTheme = {
  base: {
    color: color('light')
  },
  wrapper: {
    backgroundColor: color('grey-700'),
    borderColor: 'transparent'
  },
  hover: {
    wapper: {
      borderColor: color('grey-300')
    }
  },
  focus: {
    wrapper: {
      borderColor: color('light'),
      boxShadow: `0 0 0 1px ${color('light')}`
    }
  },
  placeholder: {
    color: color('grey-50')
  },
  error: {
    base: {
      color: color('red-500')
    },
    wrapper: {
      borderColor: color('red-500')
    },
    hover: {
      wapper: {
        borderColor: color('red-500')
      }
    },
    focus: {
      wrapper: {
        boxShadow: `0 0 0 1px ${color('red-500')}`
      }
    }
  },
  adornment: {
    color: color('grey-300')
  }
};

export { input };
