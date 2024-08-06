import { fontWeight, rounded, spacing, typography } from '../../core';
import { AccordionTheme } from '../../components';

import { color } from './colors';

const accordion: AccordionTheme = {
  base: {
    borderRadius: rounded('md'),
    border: `1px solid ${color('grey-300')}`
  },
  item: {
    base: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${color('grey-300')}`
      }
    },
    button: {
      padding: spacing('xl')
    },
    heading: {
      ...typography('lg'),
      fontWeight: fontWeight('medium')
    },
    content: {
      paddingTop: spacing('none'),
      paddingLeft: spacing('xl'),
      paddingRight: spacing('xl'),
      paddingBottom: spacing('xl')
    }
  }
};

export { accordion };
