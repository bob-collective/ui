import { StyledObject } from 'styled-components';

type TabsSize = 's' | 'md' | 'lg';

type TabsVariant = 'solid' | 'light';

type TabsTheme = {
  wrapper: StyledObject<object>;
  tab: {
    base: StyledObject<object>;
    hover: StyledObject<object>;
    selected: StyledObject<object>;
  };
  variant: Record<
    TabsVariant,
    {
      wrapper: StyledObject<object>;
      tab: {
        selected: StyledObject<object>;
      };
    }
  >;
  size: Record<
    TabsSize,
    {
      tab: {
        base: StyledObject<object>;
      };
    }
  >;
};

export type { TabsSize, TabsTheme, TabsVariant };
