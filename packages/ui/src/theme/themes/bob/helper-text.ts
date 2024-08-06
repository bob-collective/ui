import { HelperTextTheme } from '../../components';

import { color } from './colors';

const helperText: HelperTextTheme = {
  base: {
    color: color('grey-50')
  },
  error: {
    base: {
      color: color('red-500')
    }
  }
};

export { helperText };
