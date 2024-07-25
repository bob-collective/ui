import { fontSize, fontWeight, spacing, typography } from '../../core';
import { TokenInputTheme } from '../../components';

import { color } from './colors';
import { input } from './input';

// TODO: handle different sizes
const tokenInput: TokenInputTheme = {
  wrapper: {
    backgroundColor: color('grey-600'),
    borderColor: 'transparent',
    paddingLeft: spacing('lg'),
    paddingRight: spacing('lg'),
    paddingTop: '0.625rem',
    paddingBottom: '0.625rem'
  },
  hover: input.hover,
  focus: input.focus,
  base: {
    ...typography('2xl'),
    color: color('light'),
    fontWeight: fontWeight('medium')
  },
  placeholder: {
    color: color('grey-50')
  },
  error: input.error,
  usd: {
    ...typography('md'),
    color: color('grey-100')
  },
  balance: {
    fontWeight: fontWeight('medium'),
    ...typography('md')
  },
  token: {
    base: {
      borderColor: color('grey-300'),
      backgroundColor: color('grey-700'),
      padding: `0 ${spacing('md')}`,
      fontSize: fontSize('md', 'rem')
    },
    img: {
      height: spacing('3xl'),
      width: spacing('3xl')
    },
    placeholder: {
      padding: `0 ${spacing('md')} 0 ${spacing('lg')}`
    }
  },
  list: {
    base: {
      padding: `0 ${spacing('xl')}`
    },
    item: {
      ticker: {
        color: color('light'),
        fontWeight: fontWeight('medium'),
        ...typography('md')
      },
      usd: {
        color: color('grey-300'),
        fontWeight: fontWeight('medium'),
        ...typography('s')
      },
      selected: {
        ticker: {
          color: color('dark')
        },
        usd: {
          color: color('grey-300')
        }
      }
    }
  }
};

export { tokenInput };
