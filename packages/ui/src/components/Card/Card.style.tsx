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
<<<<<<< HEAD
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
=======
};

const StyledCard = styled(Flex)<StyledCardProps>`
  border-radius: ${({ $rounded, theme }) => theme.rounded($rounded)};
  cursor: ${({ $isPressable, $isDisabled }) => !$isDisabled && $isPressable && 'pointer'};
  outline: none;
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};

  // TODO: add isHoverable
  ${({ $bordered, $isPressable, $shadowed, $background, theme }) => {
    const { border, boxShadow, backgroundColor, ...baseCss } = theme.card.base;

>>>>>>> a9be729 (fix: send form)
    return css`
      ${theme.card.base}

      border-radius: ${$rounded && theme.rounded($rounded)};
      overflow: hidden;
      border: ${$borderColor && `1px solid ${$borderColor}`};
      box-shadow: ${!$shadowed && 'none'};
      background-color: ${$background && theme.color($background)};
      outline: ${!$isFocusVisible && 'none'};
      cursor: ${$isPressable && !$isDisabled && 'pointer'};

      ${$isDisabled && theme.card.disabled}

      &:hover:not([aria-disabled]) {
        ${$isHoverable && !$disableAnimation && theme.card.active}
      }

      &:active:not([aria-disabled]) {
        ${$isPressable && !$disableAnimation && theme.card.active}
      }
    `;
  }}
`;

export { StyledCard };
