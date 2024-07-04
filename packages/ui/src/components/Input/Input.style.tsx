import styled, { css } from 'styled-components';

import { InputSizes, Spacing, Theme } from '../../theme';

const sizeCSS = (theme: Theme, size: InputSizes) =>
  ({
    s: {
      ...theme.typography('s'),
      fontWeight: theme.fontWeight('normal'),
      paddingLeft: theme.spacing('md'),
      paddingRight: theme.spacing('md'),
      paddingTop: '1.75rem',
      paddingBottom: theme.spacing('s')
    },
    md: {
      ...theme.typography('md'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: '1.75rem',
      paddingBottom: theme.spacing('md')
    },
    lg: {
      ...theme.typography('xl'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: theme.spacing('md'),
      paddingBottom: theme.spacing('md')
    }
  })[size];

type BaseInputProps = {
  $size: InputSizes;
  $adornments: { left: boolean; right: boolean };
  $isDisabled: boolean;
  $hasError: boolean;
  $minHeight?: Spacing;
};

const StyledBaseInput = styled.input<BaseInputProps>`
  display: block;
  width: 100%;
  height: 100%;

  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;

  text-overflow: ellipsis;

  // Properties for textarea
  min-height: ${({ $minHeight, theme, as }) =>
    $minHeight ? theme.spacing($minHeight) : as === 'textarea' && theme.spacing('7xl')};
  resize: ${({ as }) => as === 'textarea' && 'vertical'};

  ${({ theme, $size, $adornments, $hasError }) => css`
    border-radius: ${theme.rounded('md')};
    border-style: solid;
    border-width: 1px;

    ${theme.transition('common', 'normal')}

    ${sizeCSS(theme, $size)}
      padding-left: ${$adornments.left && theme.spacing('5xl')};
    padding-right: ${$adornments.right && theme.spacing('5xl')};

    ${theme.input.base}
    ${$hasError && theme.input.error.base}


      &:hover:not(:disabled):not(:focus) {
      ${$hasError ? theme.input.error.hover : theme.input.hover}
    }

    &:focus:not(:disabled) {
      ${$hasError ? theme.input.error.focus : theme.input.focus}
    }

    &::placeholder {
      ${theme.input.placeholder}
    }

    &:disabled {
      ${theme.input.disabled}
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

type StyledAdornmentProps = {
  $size: InputSizes;
};

const StyledAdornment = styled.div<StyledAdornmentProps>`
  display: inline-flex;
  align-items: center;
  position: absolute;
  // to not allow adornment to take more than 50% of the input. We might want to reduce this in the future.
  max-width: 50%;
  ${({ theme }) => theme.input.adornment};
`;

const StyledAdornmentRight = styled(StyledAdornment)`
  top: 50%;
  right: ${({ theme }) => theme.spacing('md')};
  transform: translateY(-50%);
`;

const StyledAdornmentLeft = styled(StyledAdornment)`
  top: 50%;
  left: ${({ theme }) => theme.spacing('md')};
  transform: translateY(-50%);
`;

export { StyledAdornmentLeft, StyledAdornmentRight, StyledBaseInput };
