import { Card, Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledCard = styled(Card)`
  position: relative;

  background-image: url(${getImageUrl('apps-leaderboard-hero.png')});
  background-repeat: no-repeat;
  background-size: cover;

  ${({ theme }) => {
    return css`
      background-position: 55% 50%;

      @media ${theme.breakpoints.up('md')} {
        background-position: 50% 70%;
      }
    `;
  }}
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(91.45deg, rgba(0, 0, 0, 0) 26.23%, rgba(0, 0, 0, 0.3) 63.34%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
`;

const StyledContentWrapper = styled(Flex)`
  z-index: 1;
`;

export { StyledCard, StyledContentWrapper, StyledOpacityOverlay };
