import { CSSProperties, HTMLAttributes } from 'react';

import { Color, FontWeight, ResponsiveProp, Typography } from '../../theme';
import { NormalAlignments } from '../../theme';

type Props = {
  color?: Color;
  size?: ResponsiveProp<Typography>;
  align?: ResponsiveProp<NormalAlignments>;
  weight?: FontWeight;
  rows?: number;
  noWrap?: boolean;
  fontFamily?: string;
  lineHeight?: CSSProperties['lineHeight'];
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
