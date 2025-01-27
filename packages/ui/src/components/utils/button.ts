import { css } from 'styled-components';

import { ButtonColors, ButtonSizes, ButtonVariants, Typography } from '../../theme';

type UnstyledButtonProps = {
  $isFocusVisible?: boolean;
  $size?: Typography;
};

const unstyledButtonCSS = ({ $isFocusVisible, $size }: UnstyledButtonProps) => css`
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding: 0;
  appearance: none;
  text-align: left;
  text-decoration: none;
  color: inherit;
  touch-action: manipulation;
  outline: ${!$isFocusVisible && 'none'};
  ${({ theme }) => $size && theme.typography($size)}
`;

type StyledButtonProps = {
  $fullWidth?: boolean;
  $size: ButtonSizes;
  $color: ButtonColors;
  $variant: ButtonVariants;
  $isIconOnly?: boolean;
  hidden?: boolean;
};

const buttonCSS = (props: StyledButtonProps) => {
  const { $color, $size, $variant, hidden, $isIconOnly } = props;

  return css`
    display: ${hidden ? 'none' : 'inline-flex'};
    align-items: center;
    justify-content: center;
    width: ${props.$fullWidth ? '100%' : 'auto'};
    border: 0px solid;
    white-space: nowrap;

    user-select: none;

    ${({ theme }) => {
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
};

export { buttonCSS, unstyledButtonCSS };
export type { StyledButtonProps, UnstyledButtonProps };
