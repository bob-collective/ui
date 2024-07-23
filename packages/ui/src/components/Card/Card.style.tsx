import styled, { css } from 'styled-components';

import { Color, Rounded } from '../../theme';
import { Flex } from '../Flex';

type StyledCardProps = {
  $bordered: boolean | Color;
  $rounded: Rounded;
  $shadowed: boolean;
  $background?: Color;
  $isHoverable?: boolean;
  $isPressable?: boolean;
  $isDisabled?: boolean;
};

const StyledCard = styled(Flex)<StyledCardProps>`
  border-radius: ${({ $rounded, theme }) => theme.rounded($rounded)};
  cursor: ${({ $isPressable, $isDisabled }) => !$isDisabled && $isPressable && 'pointer'};
  outline: none;
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};

  // TODO: add isHoverable
  ${({ $bordered, $isPressable, $shadowed, $background, theme }) => {
    const { border, boxShadow, backgroundColor, ...baseCss } = theme.card.base;

    return css`
      border: ${typeof $bordered === 'boolean'
        ? $bordered
          ? border
          : undefined
        : `1px solid ${theme.color($bordered)}`};
      box-shadow: ${$shadowed && boxShadow};
      background-color: ${$background ? theme.color($background) : backgroundColor};
      ${baseCss}

      &:focus {
        ${$isPressable && $bordered && theme.card.focus}
      }
    `;
  }}
`;

export { StyledCard };
