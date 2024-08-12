import { StyledObject } from 'styled-components';

type AccordionTheme = {
  base: StyledObject<object>;
  item: {
    base?: StyledObject<object>;
    button?: StyledObject<object>;
    heading?: StyledObject<object>;
    content?: StyledObject<object>;
  };
};

export type { AccordionTheme };
