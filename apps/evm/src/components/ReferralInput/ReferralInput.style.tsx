import styled, { css } from 'styled-components';

type BaseInputProps = {
  $hasError?: boolean;
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

  ${({ theme, $hasError }) => {
    return css`
      padding: ${theme.spacing('md')};

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
