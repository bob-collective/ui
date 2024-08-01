import { StyledObject } from 'styled-components';

type LabelSizes = 's' | 'md' | 'lg';

type LabelTheme = {
  base: StyledObject<object>;
  error: {
    base: StyledObject<object>;
  };
  size: Record<LabelSizes, StyledObject<object>>;
};

export type { LabelSizes, LabelTheme };
