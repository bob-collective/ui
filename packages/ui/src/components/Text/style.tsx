import styled, { css } from 'styled-components';
import { CSSProperties } from 'react';

import { Color, FontWeight, NormalAlignments, Typography } from '../../theme';

type StyledTextProps = {
  $color: Color;
  $size: Typography;
  $weight: FontWeight;
  $align?: NormalAlignments;
  $rows?: number;
  $noWrap?: boolean;
  $fontFamily?: string;
  $lineHeight?: CSSProperties['lineHeight'];
};

const Text = styled.p<StyledTextProps>`
  ${({ theme, $size }) => theme.typography($size)}
  line-height: ${({ $lineHeight }) => $lineHeight};
  color: ${({ theme, $color }) => theme.color($color)};
  font-weight: ${({ theme, $weight }) => ($weight === 'inherit' ? $weight : theme.fontWeight($weight))};
  text-align: ${({ $align }) => $align};
  white-space: ${({ $noWrap }) => $noWrap && 'nowrap'};
  font-family: ${({ $fontFamily }) => $fontFamily};

  ${({ $rows }) =>
    $rows &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      line-clamp: ${$rows};
      -webkit-line-clamp: ${$rows};
      -webkit-box-orient: vertical;
    `}
`;

export { Text };
export type { StyledTextProps };
