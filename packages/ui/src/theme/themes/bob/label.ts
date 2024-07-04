import { LabelTheme } from '../../components';

import { color } from './colors';

const label: LabelTheme = {
  base: {
    color: color('grey-50')
  },
  error: {
    base: {
      color: color('red-500')
    }
  }
};

export { label };
