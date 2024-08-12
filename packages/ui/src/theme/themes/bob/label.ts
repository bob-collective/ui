import { LabelTheme } from '../../components';
import { fontWeight, spacing, typography } from '../../core';

import { color } from './colors';

const label: LabelTheme = {
  base: {
    color: color('grey-50'),
    fontWeight: fontWeight('medium'),
    alignSelf: 'flex-start',
    paddingRight: spacing('xs')
  },
  error: {
    base: {
      color: color('red-500')
    }
  },
  size: {
    s: typography('s'),
    md: typography('s'),
    lg: typography('md')
  }
};

export { label };
