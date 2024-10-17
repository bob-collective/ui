import { Card, Flex, P, UnstyledButton } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledCard = styled(Card)`
  position: relative;

  background-image: url(/assets/apps-leaderboard-hero.png);
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

const StyledButton = styled(UnstyledButton)`
  text-decoration: underline;
`;

const StyledDescription = styled(P)`
  max-width: 43.75rem;
`;

const StyledList = styled(Flex)`
  list-style-type: disc;

  li,
  li::marker {
    color: ${({ theme }) => theme.color('grey-50')};
  }
`;

export { StyledCard, StyledList, StyledButton, StyledDescription, StyledContentWrapper, StyledOpacityOverlay };
