import { Card, H1 } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledH1 = styled(H1)`
  ${({ theme }) => {
    return css`
      ${theme.typography('2xl')}

      @media ${theme.breakpoints.up('s')} {
        ${theme.typography('3xl')}
      }
    `;
  }}
`;

const StyledAuthCard = styled(Card)`
  max-width: 36rem;
  overflow: hidden;
`;

export { StyledAuthCard, StyledH1 };
