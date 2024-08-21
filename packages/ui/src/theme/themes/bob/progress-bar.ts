import { ProgressBarTheme } from '../../components';
import { spacing } from '../../core';

import { color } from './colors';

const progressBar: ProgressBarTheme = {
  track: {
    background: color('grey-800')
  },
  fill: {
    background: `linear-gradient(90deg, ${color('primary-500')} 0%, ${color('primary-400')} 100%)`
  },
  size: {
    s: {
      track: {
        height: spacing('s')
      },
      fill: {
        height: spacing('s')
      }
    },
    md: {
      track: {
        height: spacing('md')
      },
      fill: {
        height: spacing('md')
      }
    },
    lg: {
      track: {
        height: spacing('lg')
      },
      fill: {
        height: spacing('lg')
      }
    }
  }
};

export { progressBar };
