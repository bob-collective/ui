import { spacing, transition } from '../../core';
import { LinkTheme } from '../../components';

const link: LinkTheme = {
  base: {
    ...transition('common', 'normal')
  },
  icon: {
    marginLeft: spacing('s')
  }
};

export { link };
