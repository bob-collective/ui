import { style } from '../utils';

type LineHeight = 'none' | 'xs' | 's' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

const lineHeightBase: Record<LineHeight, number> = {
  none: 1,
  xs: 18,
  s: 20,
  md: 24,
  lg: 28,
  xl: 30,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 60,
  '6xl': 72,
  '7xl': 90
};

const lineHeight = style(lineHeightBase);

export { lineHeight };
export type { LineHeight };
