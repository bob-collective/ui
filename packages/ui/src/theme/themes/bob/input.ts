import { fontWeight, rounded, spacing, typography, transition } from '../../core';
import { InputTheme } from '../../components';

import { color } from './colors';

const input: InputTheme = {
  base: {
    display: 'block',
    width: '100%',
    outline: 'none',
    font: 'inherit',
    letterSpacing: 'inherit',
    background: 'none',
    textOverflow: 'ellipsis',
    border: 'none',
    margin: 0,
    padding: 0,
    color: color('light')
  },
  wrapper: {
    width: '100%',
    height: '100%',
    borderRadius: rounded('md'),
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: color('grey-600'),
    borderColor: 'transparent',
    ...transition('common', 'normal')
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
  disabled: {
    wrapper: {
      opacity: 0.5
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
  },
  sizes: {
    s: {
      wrapper: {
        ...typography('s'),
        fontWeight: fontWeight('normal'),
        paddingLeft: spacing('lg'),
        paddingRight: spacing('lg'),
        paddingTop: spacing('s'),
        paddingBottom: spacing('s')
      }
    },
    md: {
      wrapper: {
        ...typography('s'),
        fontWeight: fontWeight('medium'),
        paddingLeft: spacing('lg'),
        paddingRight: spacing('lg'),
        paddingTop: spacing('md'),
        paddingBottom: spacing('md')
      }
    },
    lg: {
      wrapper: {
        ...typography('md'),
        fontWeight: fontWeight('medium'),
        paddingLeft: spacing('lg'),
        paddingRight: spacing('lg'),
        paddingTop: '0.625rem',
        paddingBottom: '0.625rem'
      }
    }
  }
};

export { input };
