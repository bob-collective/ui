import { SelectTheme } from '../../components';

import { color } from './colors';
import { input } from './input';

const select: SelectTheme = {
  ...input,
  base: {
    width: '100%',
    height: '100%',
    color: color('light')
  }
};

export { select };
