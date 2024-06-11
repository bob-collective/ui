import { HTMLAttributes } from 'react';

import { Color, FontWeight, Typography } from '../../theme';
import { NormalAlignments } from '../../theme';

type Props = {
  color?: Color;
  size?: Typography;
  align?: NormalAlignments;
  weight?: FontWeight;
  rows?: number;
  noWrap?: boolean;
  fontFamily?: string;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
