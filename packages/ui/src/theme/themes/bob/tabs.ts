import { hexToRgba } from '../../utils';
import { rounded, spacing, typography, transition } from '../../core';
import { TabsTheme } from '../../components';

import { color } from './colors';

const tabs: TabsTheme = {
  wrapper: {
    backgroundColor: color('grey-600'),
    borderRadius: rounded('md'),
    padding: spacing('xs')
  },
  tab: {
    base: {
      backgroundColor: 'transparent',
      borderRadius: rounded('s'),
      color: color('light'),
      ...transition('common', 'normal')
    },
    hover: {
      color: hexToRgba(color('light'), 60)
    },
    selected: {
      top: spacing('xs'),
      bottom: spacing('xs'),
      backgroundColor: color('grey-400'),
      transition: 'transform 150ms, width 100ms',
      willChange: 'transform, width'
    }
  },
  size: {
    s: {
      tab: {
        base: {
          padding: `${spacing('s')} ${spacing('md')}`,
          ...typography('s')
        }
      }
    },
    md: {
      tab: {
        base: {
          padding: `${spacing('md')} ${spacing('lg')}`,
          ...typography('md')
        }
      }
    },
    lg: {
      tab: {
        base: {
          padding: `${spacing('lg')} ${spacing('xl')}`,
          ...typography('lg')
        }
      }
    }
  }
};

export { tabs };
