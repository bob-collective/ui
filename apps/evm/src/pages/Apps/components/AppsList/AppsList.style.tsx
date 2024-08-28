import styled, { css } from 'styled-components';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: ${({ theme }) => theme.spacing('lg')};

  ${({ theme }) => {
    return css`
      grid-template-columns: repeat(1, 1fr);

      @media ${theme.breakpoints.up('s')} {
        grid-template-columns: repeat(2, 1fr);
      }

      @media ${theme.breakpoints.up('md')} {
        grid-template-columns: repeat(3, 1fr);
      }
    `;
  }}
`;

export { StyledGrid };
