import { Card, Flex, H4 } from '@gobob/ui';
import styled from 'styled-components';

import { QuestRefCodes } from '@/utils';

type StyledCardProps = {
  $isFeatured?: boolean;
  $questOwner?: QuestRefCodes;
};

const StyledBannerWrapper = styled(Flex)`
  position: relative;
`;

const StyledBanner = styled(Flex)`
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

const StyledTitle = styled(H4)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('s')};
  background-color: ${({ theme }) => theme.color('grey-600')};
  border-radius: ${({ theme }) => theme.rounded('md')};
  padding: ${({ theme }) => `${theme.spacing('s')} ${theme.spacing('lg')}`};
`;

const StyledWrapper = styled(Flex)`
  width: 100%;
  position: relative;
`;

const StyledUnderlay = styled.div`
  top: -0.75rem;
  bottom: -0.75rem;
  left: -0.75rem;
  right: -0.75rem;
  position: absolute;
  z-index: 1;
  backdrop-filter: blur(4px);
`;

const StyledOverlay = styled(Flex)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

export {
  StyledBannerWrapper,
  StyledUnderlay,
  StyledOverlay,
  StyledWrapper,
  StyledGrid,
  StyledTitle,
  StyledBanner,
  StyledCard
};
