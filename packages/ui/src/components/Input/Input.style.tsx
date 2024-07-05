import styled, { css } from 'styled-components';

import { InputSizes, Spacing, Theme } from '../../theme';
import { Flex } from '../Flex';

const sizeCSS = (theme: Theme, size: InputSizes) =>
  ({
    s: {
      ...theme.typography('s'),
      fontWeight: theme.fontWeight('normal'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: theme.spacing('s'),
      paddingBottom: theme.spacing('s')
    },
    md: {
      ...theme.typography('s'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: theme.spacing('md'),
      paddingBottom: theme.spacing('md')
    },
    lg: {
      ...theme.typography('md'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem'
    }
  })[size];

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
  $size: InputSizes;
  $error: boolean;
  $isTextArea: boolean;
};

type StyledFieldProps = {
  $disabled: boolean;
};

const StyledWrapper = styled(Flex)<StyledWrapperProps>`
  ${({ theme, $size, $error, $isFocused, $isHovered, $isTextArea }) => css`
    width: 100%;
    height: 100%;
    border-radius: ${theme.rounded('md')};
    border-style: solid;
    border-width: 1px;

    ${theme.transition('common', 'normal')}

    ${sizeCSS(theme, $size)}
    height: ${$isTextArea && 'auto'};

    ${theme.input.wrapper}
    ${$error && theme.input.error.wrapper}
    ${$isHovered ? ($error ? theme.input.error.hover.wapper : theme.input.hover.wapper) : undefined}
    ${$isFocused ? ($error ? theme.input.error.focus.wrapper : theme.input.focus.wrapper) : undefined}
  `}
`;

const StyledBaseInput = styled.input<BaseInputProps>`
  display: block;
  width: 100%;

  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;

  text-overflow: ellipsis;

  border: none;

  margin: 0;
  padding: 0;

  // Properties for textarea
  min-height: ${({ $minHeight, theme, as }) =>
    $minHeight ? theme.spacing($minHeight) : as === 'textarea' && theme.spacing('7xl')};
  resize: ${({ as }) => as === 'textarea' && 'vertical'};

  ${({ theme, $error, $hasEndAdornment, $hasStartAdornment }) => css`
    ${theme.input.base}
    ${$error && theme.input.error.wrapper}

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
  pointer-events: none;
  ${({ theme }) => theme.input.adornment};
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  opacity: ${({ $disabled }) => $disabled && '.5'};
`;

export { StyledAdornment, StyledBaseInput, StyledWrapper, StyledField };
