import { spacing, transition } from '../../core';
import { LinkTheme } from '../../components';

const link: LinkTheme = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    ...transition('common', 'normal')
  },
  icon: {
    marginLeft: spacing('s')
  },
  hover: {
    opacity: 0.75
  },
  disabled: {
    cursor: 'default',
    opacity: 0.5
  }
};

export { link };
