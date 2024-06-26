import styled from 'styled-components';

import { StyledMarginProps } from '../../hooks';
import { Color, DividerSizes, Orientation } from '../../theme';
import { marginCSS } from '../utils/margin';

type StyledDividerProps = {
  $color: Color;
  $orientation: Orientation;
  $size: DividerSizes;
} & StyledMarginProps;

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color, theme }) => theme.color($color)};
  height: ${({ $orientation, $size, theme }) => ($orientation === 'horizontal' ? theme.divider.size[$size] : 'auto')};
  width: ${({ $orientation, $size, theme }) => ($orientation === 'horizontal' ? '' : theme.divider.size[$size])};
  border: 0;
  margin: 0;
  align-self: stretch;
  flex-shrink: 0;
  ${(props) => marginCSS(props)};
`;

export { StyledDivider };
