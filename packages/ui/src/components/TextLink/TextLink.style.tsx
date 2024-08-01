import styled from 'styled-components';

import { ArrowTopRightOnSquare } from '../../icons';
import { Color, FontWeight, Typography } from '../../theme';

type BaseTextLinkProps = {
  $color: Color;
  $isQuiet?: boolean;
  $size: Typography;
  $weight?: FontWeight;
};

const BaseTextLink = styled.a<BaseTextLinkProps>`
  display: inline-flex;
  align-items: center;
  color: ${({ $color, theme }) => $color && theme.color($color)};
  ${({ $size, theme }) => $size && theme.typography($size)};
  font-weight: ${({ $weight, theme }) => $weight && theme.fontWeight($weight)};
  text-decoration: ${(props) => (props.$isQuiet ? 'none' : 'underline')};

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
`;

const StyledIcon = styled(ArrowTopRightOnSquare)`
  margin-left: ${({ theme }) => theme.spacing('s')};
  // FIXME: remove important
  width: 1em !important;
  height: 1em !important;
  color: inherit;
`;

export { BaseTextLink, StyledIcon };
