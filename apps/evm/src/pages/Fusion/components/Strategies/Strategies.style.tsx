import { Card, Chip, Flex, H4 } from '@gobob/ui';
import styled from 'styled-components';

import { QuestRefCodes } from '../../../../utils';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

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
  background-image: url(${getImageUrl('spice-shape-background.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
`;

const StyledPrize = styled(Chip)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing('xl')};
  left: 50%;
  transform: translateX(-50%);
`;

const StyledCard = styled(Card)<StyledCardProps>`
  position: relative;
  height: 7.5rem;
`;

const StyledGrid = styled(Flex)`
  display: grid;

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

export { StyledBannerWrapper, StyledGrid, StyledTitle, StyledBanner, StyledCard, StyledPrize };
