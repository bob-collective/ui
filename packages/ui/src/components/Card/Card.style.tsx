import styled, { css } from 'styled-components';

import { Color, Rounded } from '../../theme';
import { Flex } from '../Flex';

type StyledCardProps = {
  $borderColor?: Color;
  $rounded?: Rounded;
  $shadowed: boolean;
  $background?: Color;
  $isFocusVisible?: boolean;
  $isPressable?: boolean;
  $isDisabled?: boolean;
  $isHoverable?: boolean;
  $disableAnimation?: boolean;
};

const StyledCard = styled(Flex)<StyledCardProps>`
  ${({
    $borderColor,
    $isPressable,
    $isHoverable,
    $isDisabled,
    $shadowed,
    $background,
    $isFocusVisible,
    $disableAnimation,
    $rounded,
    theme
  }) => {
    return css`
      ${theme.card.base}

      border-radius: ${$rounded && theme.rounded($rounded)};
      overflow: hidden;
      border: ${$borderColor && `1px solid ${$borderColor}`};
      box-shadow: ${!$shadowed && 'none'};
      background-color: ${$background && theme.color($background)};
      outline: ${!$isFocusVisible && 'none'};
      cursor: ${$isPressable && 'pointer'};

      ${$isDisabled && theme.card.disabled}

      &:hover:not([disabled]) {
        ${$isHoverable && !$disableAnimation && theme.card.active}
      }

      &:active:not([disabled]) {
        ${$isPressable && !$disableAnimation && theme.card.active}
      }
    `;
  }}
`;

export { StyledCard };
