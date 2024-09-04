import { Card, Dl } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledDl = styled(Dl)`
  ${({ theme }) => {
    return css`
      display: grid;
      grid-auto-rows: auto;

      grid-template-columns: repeat(1, 1fr);

      @media ${theme.breakpoints.up('s')} {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
      }

      @media ${theme.breakpoints.up('md')} {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }

      @media ${theme.breakpoints.up('lg')} {
        display: flex;
      }
    `;
  }}
`;

const StyledLoginCard = styled(Card)`
  max-width: ${({ theme }) => theme.maxWidth('lg')};
`;

const StyledCard = styled(Card)`
  ${({ theme }) => {
    return css`
      @media ${theme.breakpoints.up('s')} {
        &:last-of-type {
          grid-column: span 2 / span 2;
        }
      }
    `;
  }}
`;

export { StyledDl, StyledLoginCard, StyledCard };
