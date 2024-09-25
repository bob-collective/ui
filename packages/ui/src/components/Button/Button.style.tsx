import styled, { css } from 'styled-components';

import { ButtonColors, ButtonSizes, ButtonVariants } from '../../theme';
import { UnstyledButton } from '../UnstyledButton';

type StyledButtonProps = {
  $fullWidth?: boolean;
  $size: ButtonSizes;
  $color: ButtonColors;
  $variant: ButtonVariants;
  $isIconOnly?: boolean;
};

const StyledButton = styled(UnstyledButton)<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  border: 0px solid;
  white-space: nowrap;

  user-select: none;

  ${({ theme, $size, $variant, $color, $isIconOnly }) => {
    const { hover } = theme.button.variant[$variant].color[$color];

    return css`
      ${theme.button.base}
      ${theme.button.size[$size]}
      ${theme.button.variant[$variant].color[$color].base}
      ${$isIconOnly &&
      css`
        padding: 0;
        width: ${theme.button.size[$size].height};
      `}
      

      &:hover:not([disabled]) {
        ${hover}
      }

      &:active:not([disabled]) {
        ${theme.button.active}
      }

      &[aria-disabled='true'],
      &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        ${theme.button.disabled}
      }
    `;
  }}
`;

export { StyledButton };
