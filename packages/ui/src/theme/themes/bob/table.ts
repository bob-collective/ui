import { hexToRgba } from '../../utils';
import { fontWeight, rounded, spacing, typography } from '../../core';
import { TableTheme } from '../../components';

import { color } from './colors';

const table: TableTheme = {
  base: {},
  columnHeader: {
    paddingTop: spacing('lg'),
    paddingLeft: spacing('lg'),
    paddingBottom: spacing('lg'),
    color: color('light'),
    fontWeight: fontWeight('bold'),
    ...typography('xs'),
    '&:first-of-type': {
      paddingRight: spacing('lg'),
      borderTopLeftRadius: rounded('md'),
      borderBottomLeftRadius: rounded('md')
    },
    '&:last-of-type': {
      textAlign: 'right',
      paddingRight: spacing('lg'),
      borderTopRightRadius: rounded('md'),
      borderBottomRightRadius: rounded('md')
    }
  },
  cell: {
    paddingTop: spacing('md'),
    paddingLeft: spacing('md'),
    paddingBottom: spacing('md'),
    color: color('light'),
    ...typography('s'),
    '&:first-of-type': {
      borderTopLeftRadius: rounded('md'),
      borderBottomLeftRadius: rounded('md')
    },
    '&:last-of-type': {
      textAlign: 'right',
      paddingRight: spacing('md'),
      borderTopRightRadius: rounded('md'),
      borderBottomRightRadius: rounded('md')
    }
  },
  headerRow: {
    backgroundColor: color('grey-600')
  },
  row: {
    base: {
      // backgroundColor: color('grey-700')
    },
    hover: {
      backgroundColor: hexToRgba(color('grey-600'), 40)
    },
    selected: {
      backgroundColor: color('grey-600')
    }
  }
};

export { table };
