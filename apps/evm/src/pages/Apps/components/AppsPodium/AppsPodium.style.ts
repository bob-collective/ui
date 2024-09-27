import { Card, Flex, H2 } from '@gobob/ui';
import styled, { css } from 'styled-components';

import { Medal } from '../Medal';

import { Confetti } from './Confetti';
import { Podiums } from './Podiums';

type StyledPodiumCardProps = {
  $color: { border: string; background: string };
};

const StyledCard = styled(Card)`
  position: relative;
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(91.45deg, rgba(0, 0, 0, 0) 26.23%, rgba(0, 0, 0, 0.5) 63.34%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
`;

const StyledAvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledMedal = styled(Medal)`
  position: absolute;
  top: 0;
  left: 0.25rem;
`;

const StyledContentWrapper = styled(Flex)`
  z-index: 1;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  max-width: 21rem;
`;

const StyledH2 = styled(H2)`
  ${({ theme }) => {
    return css`
      @media ${theme.breakpoints.up('md')} {
        max-width: 24rem;
      }
    `;
  }}
`;
const StyledPodiumCard = styled(Card)<StyledPodiumCardProps>`
  position: relative;
  background-color: unset;

  &::before {
    content: ' ';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }

  &::after {
    content: ' ';
    position: absolute;
    inset: 0;
    background-color: transparent;
    border-top: 1px solid ${({ $color }) => $color.border};
    border-right: 1px solid ${({ $color }) => $color.border};
    border-left: 1px solid ${({ $color }) => $color.border};
    z-index: 0;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.1),
      /* fully opaque at the bottom */ rgba(0, 0, 0, 0) /* fully transparent at the top */
    );
  }
`;

const StyledPodiumCardInner = styled(Flex)<StyledPodiumCardProps>`
  border-radius: inherit;
  background: linear-gradient(360deg, #070707 45%, #1e2430 60%, ${({ $color }) => $color.background} 100%);

  z-index: 10;
`;

const StyledConfetti = styled(Confetti)`
  position: absolute;
  z-index: 0;
  inset: 0;
`;

const StyledPodiums = styled(Podiums)`
  width: 100%;
`;

export {
  StyledCard,
  StyledH2,
  StyledGrid,
  StyledAvatarWrapper,
  StyledContentWrapper,
  StyledMedal,
  StyledPodiumCard,
  StyledOpacityOverlay,
  StyledConfetti,
  StyledPodiums,
  StyledPodiumCardInner
};
