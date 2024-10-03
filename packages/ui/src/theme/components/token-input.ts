import { StyledObject } from 'styled-components';

import { InputSizes, InputTheme } from './input';

type TokenInputSize = InputSizes;

type TokenInputTheme = Omit<InputTheme, 'adornment' | 'sizes'> & {
  inputWrapper: StyledObject<object>;
  divider: StyledObject<object>;
  bottomWrapper: StyledObject<object>;
  usd: StyledObject<object>;
  balance: StyledObject<object>;
  token: { base: StyledObject<object>; placeholder: StyledObject<object>; img: StyledObject<object> };
  list: {
    base: StyledObject<object>;
    item: {
      ticker: StyledObject<object>;
      name: StyledObject<object>;
      amount: StyledObject<object>;
      usd: StyledObject<object>;
      img: StyledObject<object>;
    };
  };
};

export type { TokenInputTheme, TokenInputSize };
