import { fontSize, fontWeight, spacing, typography } from '../../core';
import { TokenInputTheme } from '../../components';

import { color } from './colors';
import { input } from './input';

const tokenInput: TokenInputTheme = {
  wrapper: input.wrapper,
  placeholder: input.placeholder,
  hover: input.hover,
  focus: input.focus,
  error: input.error,
  disabled: input.disabled,
  base: {
    ...input.base,
    ...typography('2xl'),
    fontWeight: fontWeight('medium')
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
      padding: `${spacing('s')} ${spacing('xl')} 0 ${spacing('xl')}`,
      overflow: 'auto',
      '> :last-child': {
        marginBottom: spacing('xl')
      }
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
