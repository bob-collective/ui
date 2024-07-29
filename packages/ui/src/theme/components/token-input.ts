import { StyledObject } from 'styled-components';

import { InputSizes } from './input';

type TokenInputSize = InputSizes;

type TokenInputTheme = {
  wrapper: StyledObject<object>;
  inputWrapper: StyledObject<object>;
  divider: StyledObject<object>;
  bottomWrapper: StyledObject<object>;
  base: StyledObject<object>;
  placeholder: StyledObject<object>;
  error: {
    base: StyledObject<object>;
    wrapper: StyledObject<object>;
    hover: { wapper: StyledObject<object> };
    focus: { wrapper: StyledObject<object> };
  };
  hover: { wapper: StyledObject<object> };
  focus: { wrapper: StyledObject<object> };
  usd: StyledObject<object>;
  balance: StyledObject<object>;
  token: { base: StyledObject<object>; placeholder: StyledObject<object>; img: StyledObject<object> };
  list: {
    base: StyledObject<object>;
    item: {
      ticker: StyledObject<object>;
      usd: StyledObject<object>;
      img: StyledObject<object>;
    };
  };
};

export type { TokenInputTheme, TokenInputSize };
