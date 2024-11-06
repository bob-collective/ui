import styled, { css } from 'styled-components';

import { InputSizes, Spacing } from '../../theme';
import { Flex } from '../Flex';

type BaseInputProps = {
  $minHeight?: Spacing;
  $error: boolean;
  $hasStartAdornment: boolean;
  $hasEndAdornment: boolean;
};

type StyledAdornmentProps = {
  $size: InputSizes;
};

type StyledWrapperProps = {
  $isHovered: boolean;
  $isFocused: boolean;
  $isDisabled: boolean;
  $size: InputSizes;
  $error: boolean;
  $isTextArea: boolean;
};

type StyledFieldProps = {
  $maxWidth?: Spacing;
};

const StyledWrapper = styled(Flex)<StyledWrapperProps>`
  ${({ theme, $size, $error, $isFocused, $isHovered, $isTextArea, $isDisabled }) => css`
    height: ${$isTextArea && 'auto'};

    ${theme.input.wrapper}
    ${theme.input.sizes[$size].wrapper}
    ${$error && theme.input.error.wrapper}
    ${$isHovered ? ($error ? theme.input.error.hover.wapper : theme.input.hover.wapper) : undefined}
    ${$isFocused ? ($error ? theme.input.error.focus.wrapper : theme.input.focus.wrapper) : undefined}
    ${$isDisabled && theme.input.disabled.wrapper}
  `}
`;

const StyledBaseInput = styled.input<BaseInputProps>`
  // Properties for textarea
  min-height: ${({ $minHeight, theme, as }) =>
    $minHeight ? theme.spacing($minHeight) : as === 'textarea' && theme.spacing('7xl')};
  resize: ${({ as }) => as === 'textarea' && 'vertical'};

  ${({ theme, $error, $hasEndAdornment, $hasStartAdornment }) => css`
    ${theme.input.base}
    ${$error && theme.input.error.base}

    padding-inline-start: ${$hasStartAdornment && '.375rem'};
    padding-inline-end: ${$hasEndAdornment && '.375rem'};

    &::placeholder {
      ${theme.input.placeholder}
    }
  `}

  /* MEMO: inspired by https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const StyledAdornment = styled.div<StyledAdornmentProps>`
  display: inline-flex;
  align-items: flex-end;
  // to not allow adornment to take more than 50% of the input. We might want to reduce this in the future.
  max-width: 50%;
  ${({ theme }) => theme.input.adornment};
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  max-width: ${({ $maxWidth, theme }) => $maxWidth && theme.spacing($maxWidth)};
`;

export { StyledAdornment, StyledBaseInput, StyledWrapper, StyledField };
