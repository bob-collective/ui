import { fontWeight, rounded, spacing, typography } from '../../core';
import { AccordionTheme } from '../../components';

const accordion: AccordionTheme = {
  base: {
    borderRadius: rounded('md')
  },
  item: {
    base: {},
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
