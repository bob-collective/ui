import { fontSize, fontWeight, spacing, typography } from '../../core';
import { TokenInputTheme } from '../../components';

import { color } from './colors';
import { input } from './input';

const tokenInput: TokenInputTheme = {
  wrapper: {
    backgroundColor: color('grey-800'),
    borderColor: 'transparent'
  },
  inputWrapper: {
    paddingLeft: spacing('lg'),
    paddingRight: spacing('lg'),
    paddingTop: '0.625rem',
    paddingBottom: spacing('md')
  },
  divider: {
    marginLeft: spacing('lg'),
    marginRight: spacing('lg'),
    marginBottom: spacing('md')
  },
  bottomWrapper: {
    paddingLeft: spacing('lg'),
    paddingRight: spacing('lg'),
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
    color: color('grey-50')
  },
  balance: {
    fontWeight: fontWeight('medium'),
    ...typography('md')
  },
  token: {
    base: {
      borderColor: color('grey-300'),
      backgroundColor: color('grey-500'),
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
        color: color('grey-50'),
        fontWeight: fontWeight('medium'),
        ...typography('s')
      },
      img: {
        height: spacing('4xl'),
        width: spacing('4xl')
      }
    }
  }
};

export { tokenInput };
