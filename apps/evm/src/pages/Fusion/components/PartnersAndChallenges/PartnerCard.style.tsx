import { Card, P } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledCategoryTag = styled(P)`
  ${({ theme }) => css`
    background: #3e424b;
    border-radius: ${theme.rounded('xs')};
    color: white;
    padding: ${theme.spacing('xs')};
  `}
`;

const StyledGrid = styled.div`
  width: 100%;
  display: grid;
  align-self: center;
  ${({ theme }) => css`
    grid-template-rows: repeat(4, minmax(0, 1fr));
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-items: space-between;
    gap: ${theme.spacing('2xl')};

    @media ${theme.breakpoints.up('s')} {
      grid-template-rows: repeat(1, minmax(0, 1fr));
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media ${theme.breakpoints.up('lg')} {
      grid-template-rows: repeat(1, minmax(0, 1fr));
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  `}
`;

const StyledPartnerCard = styled(Card)`
  position: relative;
`;

const StyledLiveTag = styled(Card)`
  position: absolute;
  right: ${({ theme }) => theme.spacing('s')};
  top: ${({ theme }) => theme.spacing('s')};
`;

const StyledIconWrapper = styled('div')`
  position: absolute;
  top: 4px;
  left: 4px;
`;

export { StyledCategoryTag, StyledGrid, StyledPartnerCard, StyledLiveTag, StyledIconWrapper };
