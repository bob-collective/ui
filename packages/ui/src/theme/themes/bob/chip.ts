import { ChipTheme } from '../../components';
import { rounded, transition, typography } from '../../core';

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
      base: { height: '1.5rem', paddingLeft: '0.25rem', paddingRight: '0.25rem', ...typography('xs') },
      content: { paddingLeft: '0.25rem', paddingRight: '0.25rem' }
    },
    md: {
      base: { height: '1.75rem', paddingLeft: '0.25rem', paddingRight: '0.25rem', ...typography('s') },
      content: { paddingLeft: '0.5rem', paddingRight: '0.5rem' }
    },
    lg: {
      base: { height: '2rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', ...typography('md') },
      content: { paddingLeft: '0.5rem', paddingRight: '0.5rem' }
    }
  }
};

export { chip };
