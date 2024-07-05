import { StyledObject } from 'styled-components';

type InputSizes = 's' | 'md' | 'lg';

type InputTheme = {
  base: StyledObject<object>;
  wrapper: StyledObject<object>;
  hover: { wapper: StyledObject<object> };
  focus: { wrapper: StyledObject<object> };
  error: {
    base: StyledObject<object>;
    wrapper: StyledObject<object>;
    hover: { wapper: StyledObject<object> };
    focus: { wrapper: StyledObject<object> };
  };
  disabled: { wrapper: StyledObject<object> };
  placeholder: StyledObject<object>;
  adornment: StyledObject<object>;
};

export type { InputSizes, InputTheme };
