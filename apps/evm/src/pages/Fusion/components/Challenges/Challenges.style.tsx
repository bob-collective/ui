import styled, { css } from 'styled-components';
import Slider from 'react-slick';
import { Card, Chip, Flex, Span } from '@gobob/ui';

import { Trapezoid } from '../../../../components';
import { QuestRefCodes } from '../../../../utils';

import { CubsPath } from './CubsPath';

type StyledCardProps = {
  $isFeatured?: boolean;
  $questOwner?: QuestRefCodes;
};

const StyledAvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledCubsPath = styled(CubsPath)`
  width: 100%;
  height: auto;
`;

const StyledPrize = styled(Chip)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing('xl')};
  left: 50%;
  transform: translateX(-50%);
`;

const StyledQuestWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StyledCard = styled(Card)<StyledCardProps>`
  position: relative;
  border: 2px solid
    ${({ $isFeatured, $questOwner }) =>
      $isFeatured && $questOwner ? ($questOwner === QuestRefCodes.INTRACT ? '#25D1F7' : '#C0A1EA') : 'transparent'};
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-color: ${({ theme }) => theme.color('dark')};
  z-index: 2;
`;

const StyledCompletedTag = styled(Span)`
  background-color: ${({ theme }) => theme.color('grey-500')};
  border: 1px solid ${({ theme }) => theme.color('grey-300')};
  padding: ${({ theme }) => `0 ${theme.spacing('md')}`};
  border-radius: ${({ theme }) => theme.rounded('md')};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);

  z-index: 4;
`;

const StyledSlider = styled(Slider)`
  ${({ theme }) => {
    return css`
      margin-left: -${theme.spacing('lg')};
      margin-right: -${theme.spacing('lg')};

      @media ${theme.breakpoints.up('s')} {
        margin-left: -${theme.spacing('s')};
        margin-right: -${theme.spacing('s')};
      }
    `;
  }}
`;

const StyledDescription = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  &,
  span,
  p {
    color: ${({ theme }) => theme.color('grey-50')} !important;
    ${({ theme }) => theme.typography('s')}
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  display: flex;
  position: relative;
`;

const StyledTrapezoid = styled(Trapezoid)`
  position: absolute;
  z-index: 10;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledSliderWrapper = styled(Flex)`
  position: relative;
  pointer-events: none;
`;

const StyledUnderlay = styled.div`
  top: -0.75rem;
  bottom: -0.75rem;
  left: -0.75rem;
  right: -0.75rem;
  position: absolute;
  z-index: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const StyledOverlay = styled(Flex)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

export {
  StyledUnderlay,
  StyledOverlay,
  StyledSliderWrapper,
  StyledAvatarWrapper,
  StyledOpacityOverlay,
  StyledDescription,
  StyledPrize,
  StyledSlider,
  StyledQuestWrapper,
  StyledCubsPath,
  StyledCompletedTag,
  StyledCard,
  StyledAnchor,
  StyledTrapezoid
};
