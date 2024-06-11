import { rounded, spacing, typography, transition } from '../../core';
import { TabsTheme } from '../../components';

import { color } from './colors';

const tabs: TabsTheme = {
  base: {
    backgroundColor: color('grey-900'),
    borderRadius: rounded('md')
  },
  item: {
    base: {
      backgroundColor: 'transparent',
      borderRadius: rounded('s'),
      color: color('light'),
      ...transition('common', 'normal')
    },
    hover: {
      border: `1px solid ${color('grey-300')}`
    },
    focus: {
      border: `1px solid ${color('light')}`,
      boxShadow: `0 0 0 1px ${color('light')}`
    },
    selected: {
      backgroundColor: color('grey-500'),
      border: `1px solid ${color('grey-400')}`,
      transition: 'transform 150ms, width 100ms',
      willChange: 'transform, width'
    },
    focusVisible: {
      borderRadius: rounded('md'),
      border: `2px solid ${color('light')}`
    }
  },
  size: {
    s: {
      base: {
        padding: spacing('xs'),
        top: spacing('xs'),
        bottom: spacing('xs')
      },
      item: {
        padding: `${spacing('s')} ${spacing('md')}`,
        ...typography('s')
      },
      focusVisible: {
        top: `-${spacing('xs')}`,
        left: `-${spacing('xs')}`,
        right: `-${spacing('xs')}`,
        bottom: `-${spacing('xs')}`
      }
    },
    md: {
      base: {
        padding: spacing('xs'),
        top: spacing('xs'),
        bottom: spacing('xs')
      },
      item: {
        padding: `${spacing('md')} ${spacing('lg')}`,
        ...typography('md')
      },

      focusVisible: {
        top: `-${spacing('xs')}`,
        left: `-${spacing('xs')}`,
        right: `-${spacing('xs')}`,
        bottom: `-${spacing('xs')}`
      }
    },
    lg: {
      base: {
        padding: spacing('xs'),
        top: spacing('xs'),
        bottom: spacing('xs')
      },
      item: {
        padding: `${spacing('lg')} ${spacing('xl')}`,
        ...typography('lg')
      },
      focusVisible: {
        top: `-${spacing('xs')}`,
        left: `-${spacing('xs')}`,
        right: `-${spacing('xs')}`,
        bottom: `-${spacing('xs')}`
      }
    }
  }
};

export { tabs };
