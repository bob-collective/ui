import styled, { css } from 'styled-components';

type BaseInputProps = {
  $hasError?: boolean;
};

const StyledBaseInput = styled.input<BaseInputProps>`
  ${({ theme, $hasError }) => {
    return css`
      ${theme.input.base}
      ${theme.input.wrapper}

      padding: ${theme.spacing('md')};
      ${$hasError && theme.input.error.base}

      &:hover:not(:disabled):not(:focus) {
        ${$hasError ? theme.input.error.hover.wapper : theme.input.hover.wapper}
      }

      &:focus:not(:disabled) {
        ${$hasError ? theme.input.error.focus.wrapper : theme.input.focus.wrapper}
      }

      &::placeholder {
        ${theme.input.placeholder}
      }

      &:disabled {
        ${theme.input.disabled}
      }

      font-weight: ${theme.fontWeight('bold')};
      text-align: center;

      flex: 1;

      width: 100%;

      height: ${({ theme }) => theme.spacing('6xl')};
      max-width: ${({ theme }) => theme.spacing('6xl')};
      ${theme.typography('xl')}

      @media ${theme.breakpoints.up('s')} {
        height: ${({ theme }) => theme.spacing('7xl')};
        max-width: ${({ theme }) => theme.spacing('7xl')};
        ${theme.typography('4xl')}
      }
    `;
  }}
`;

export { StyledBaseInput };
