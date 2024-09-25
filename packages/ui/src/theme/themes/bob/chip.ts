import { ChipTheme } from '../../components';
import { rounded, spacing, transition, typography } from '../../core';

import { color } from './colors';

const chip: ChipTheme = {
  base: {
    color: color('light'),
    backgroundColor: color('grey-400'),
    borderRadius: rounded('full'),
    ...transition('common', 'normal')
  },
  size: {
    s: {
      base: { height: '1.5rem', paddingLeft: spacing('xs'), paddingRight: spacing('xs'), ...typography('xs') },
      content: {
        base: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') },
        adornment: {
          start: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') },
          end: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') },
          both: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') }
        }
      }
    },
    md: {
      base: { height: '1.75rem', paddingLeft: spacing('xs'), paddingRight: spacing('xs'), ...typography('s') },

      content: {
        base: { paddingLeft: spacing('md'), paddingRight: spacing('md') },
        adornment: {
          start: { paddingLeft: spacing('xs'), paddingRight: spacing('md') },
          end: { paddingLeft: spacing('md'), paddingRight: spacing('xs') },
          both: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') }
        }
      }
    },
    lg: {
      base: { height: '2rem', paddingLeft: spacing('md'), paddingRight: spacing('md'), ...typography('md') },
      content: {
        base: { paddingLeft: spacing('md'), paddingRight: spacing('md') },
        adornment: {
          start: { paddingLeft: spacing('xs'), paddingRight: spacing('md') },
          end: { paddingLeft: spacing('md'), paddingRight: spacing('xs') },
          both: { paddingLeft: spacing('xs'), paddingRight: spacing('xs') }
        }
      }
    }
  }
};

export { chip };
