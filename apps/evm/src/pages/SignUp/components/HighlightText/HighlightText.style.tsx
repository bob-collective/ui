import styled, { CSSProperties } from 'styled-components';

type StyledHighlightProps = {
  $display?: CSSProperties['display'];
};

const StyledHighlight = styled.span<StyledHighlightProps>`
  display: ${({ $display }) => $display};
  font: inherit;
  color: ${({ theme }) => theme.color('dark')};
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.color('primary-500')} 0%, ${theme.color('primary-400')} 100%)`};
`;

export { StyledHighlight };
