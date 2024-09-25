import { Card, Flex, H2 } from '@gobob/ui';
import styled, { css } from 'styled-components';

import { Medal } from '../Medal';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledCard = styled(Card)`
  position: relative;

  background-image: url(${getImageUrl('podium-background.png')});
  background-repeat: no-repeat;
  background-size: cover;

  ${({ theme }) => {
    return css`
      background-position: 50% 50%;

      @media ${theme.breakpoints.up('md')} {
        background-position: 50% 75%;
      }

      @media ${theme.breakpoints.up('lg')} {
        background-position: 50% 65%;
      }
    `;
  }}
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(91.45deg, rgba(0, 0, 0, 0) 26.23%, rgba(0, 0, 0, 0.5) 63.34%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
`;

const StyledAvatarWrapper = styled.div`
  position: relative;
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

export {
  StyledCard,
  StyledH2,
  StyledGrid,
  StyledAvatarWrapper,
  StyledContentWrapper,
  StyledMedal,
  StyledOpacityOverlay
};
