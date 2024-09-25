import { StyledObject } from 'styled-components';

type ChipSize = 's' | 'md' | 'lg';

type ChipTheme = {
  base: StyledObject<object>;
  size: Record<
    ChipSize,
    {
      base: StyledObject<object>;
      content: {
        base: StyledObject<object>;
        adornment: { start: StyledObject<object>; end: StyledObject<object>; both: StyledObject<object> };
      };
    }
  >;
};

export type { ChipTheme, ChipSize };
