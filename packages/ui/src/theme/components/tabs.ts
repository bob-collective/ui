import { StyledObject } from 'styled-components';

type TabsSize = 's' | 'md' | 'lg';

type TabsTheme = {
  wrapper: StyledObject<object>;
  tab: {
    base: StyledObject<object>;
    hover: StyledObject<object>;
    selected: StyledObject<object>;
  };
  size: Record<
    TabsSize,
    {
      tab: {
        base: StyledObject<object>;
      };
    }
  >;
};

export type { TabsSize, TabsTheme };
