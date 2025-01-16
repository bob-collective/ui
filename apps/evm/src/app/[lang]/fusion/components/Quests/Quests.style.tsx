import { Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

import { QuestRefCodes } from '@/utils';

type StyledCardProps = {
  $isFeatured?: boolean;
  $questOwner?: QuestRefCodes;
};

const StyledBannerWrapper = styled(Flex)`
  position: relative;
`;

const StyledBanner = styled(Card)`
  position: absolute;
  inset: 0;
`;

const StyledCard = styled(Card)<StyledCardProps>`
  position: relative;
  height: 7.5rem;
`;

const StyledGrid = styled(Flex)`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr;

  grid-template-rows: 1fr 1fr;

  @media ${({ theme }) => theme.breakpoints.up('s')} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    ${StyledCard} {
      grid-column: span 2 / span 2;

      &:nth-of-type(3) {
        grid-column-start: 2;
      }
    }
  }

  @media ${({ theme }) => theme.breakpoints.up('md')} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;

    ${StyledCard} {
      grid-column: span 1 / span 1;

      &:nth-of-type(3) {
        grid-column-start: unset;
      }
    }
  }
`;

const StyledWrapper = styled(Flex)`
  width: 100%;
  position: relative;
`;

export { StyledBanner, StyledBannerWrapper, StyledCard, StyledGrid, StyledWrapper };
