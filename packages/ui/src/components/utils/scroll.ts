import { css } from 'styled-components';

const customScrollbarCSS = css`
  &::-webkit-scrollbar {
    ${({ theme }) => theme.scroll.base}
  }

  &::-webkit-scrollbar-thumb {
    ${({ theme }) => theme.scroll.thumb}
  }

  &::-webkit-scrollbar-button {
    ${({ theme }) => theme.scroll.button}
  }

  &::-webkit-scrollbar-corner {
    ${({ theme }) => theme.scroll.corner}
  }
`;

export { customScrollbarCSS };
