import { Card } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledBackersCard = styled(Card)`
  width: 100%;
  position: relative;
`;

const StyledBackerLogos = styled.div`
  width: 100%;
  display: grid;
  align-items: center;

  ${({ theme }) => css`
    grid-template-rows: auto;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-items: center;
    gap: ${theme.spacing('2xl')};

    @media ${theme.breakpoints.up('s')} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-width: ${theme.maxWidth('md')};
    }

    @media ${theme.breakpoints.up('md')} {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      max-width: ${theme.maxWidth('3xl')};
    }

    @media ${theme.breakpoints.up('lg')} {
      grid-template-columns: repeat(8, minmax(0, 1fr));
      grid-template-row: repeat(1, minmax(0, 1fr));
      max-width: 100%;
      max-width: ${theme.maxWidth('7xl')};

      > :last-child {
        grid-column: span 1 / span 1;
      }
    }
  `}
`;

const StyledImg = styled.img`
  max-width: 100%;
  height: auto;
`;

export { StyledBackersCard, StyledBackerLogos, StyledImg };
