import styled, { css } from 'styled-components';

import { Orientation, RadioSize, Spacing } from '../../theme';
import { Flex } from '../Flex';
import { visuallyHidden } from '../utils/visually-hidden';
import { Label } from '../Label';

type StyledRadioGroupProps = {
  $orientation: Orientation;
  $gap?: Spacing;
};

type StyledLabelProps = {
  $isDisabled?: boolean;
  $flex?: number | string | boolean;
};

type StyledFieldProps = {
  $isDisabled?: boolean;
};

type StyledButtonProps = {
  $size: RadioSize;
  $isSelected: boolean;
  $isHovered: boolean;
  $isInvalid: boolean;
};

const StyledRadioGroup = styled(Flex)<StyledRadioGroupProps>`
  width: 100%;

  label {
    margin-right: ${({ $orientation, $gap, theme }) => $orientation === 'horizontal' && $gap && theme.spacing($gap)};
    margin-bottom: ${({ $orientation, $gap, theme }) => $orientation === 'vertical' && $gap && theme.spacing($gap)};
  }
`;

const StyledLabel = styled(Label)<StyledLabelProps>`
  padding: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing('md')};
  align-items: center;
  opacity: ${({ $isDisabled }) => $isDisabled && 0.5};
  flex: ${({ $flex }) => (typeof $flex === 'boolean' ? '1' : $flex)};
  ${({ theme, error }) => css`
    ${theme.radio.base}
    ${error && theme.radio.error.base}
  `}
`;

const StyledInput = styled.input`
  ${visuallyHidden()}
`;

const StyledButton = styled.span<StyledButtonProps>`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  outline: none;
  border-radius: 50%;
  opacity: ${({ $isHovered }) => $isHovered && 0.9};

  ${({ theme, $size, $isSelected, $isInvalid }) => {
    const { button, selected, size, error } = theme.radio;
    const { button: buttonSize, selected: selectedSize } = size[$size];

    return css`
      ${button.base}
      ${buttonSize.base}
      ${$isSelected && selected.button.base}
      ${$isInvalid && error.button.base}
      
      &::after {
        content: '';
        border-radius: 50%;
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: inherit;

        ${button.inside}
        ${$isSelected && selected.button.inside}
        ${$isInvalid && error.button.inside}
        ${$isSelected && selectedSize.button.inside}
      }
    `;
  }}
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};
`;

export { StyledLabel, StyledRadioGroup, StyledButton, StyledField, StyledInput };
