import { Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

import { Medal } from '../Medal';

import { Confetti } from './Confetti';

type StyledPodiumCardProps = {
  $color: { border: string; background: string };
};

const StyledAvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledMedal = styled(Medal)`
  position: absolute;
  top: 0;
  left: 0.25rem;
`;

const StyledPodiumCard = styled(Card)<StyledPodiumCardProps>`
  position: relative;
  background-color: unset;
  overflow-y: hidden;
  overflow-x: visible;

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
    background: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
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

  @media ${({ theme }) => theme.breakpoints.down('md')} {
    left: 50%;
    transform: translateX(-50%);
    max-width: 450px;
    width: 100%;
  }
`;

const StyledPodiumWrapper = styled(Flex)`
  margin-bottom: -2px;
`;

const StyledPodiums = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('md')};
`;

export {
  StyledAvatarWrapper,
  StyledConfetti,
  StyledMedal,
  StyledPodiumCard,
  StyledPodiumCardInner,
  StyledPodiums,
  StyledPodiumWrapper
};
