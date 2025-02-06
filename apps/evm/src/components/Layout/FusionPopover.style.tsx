import styled, { css } from 'styled-components';
import { Card, Chip, Flex } from '@gobob/ui';

const StyledHarvestCard = styled(Card)`
  position: relative;
  background-image: url(/assets/harvest-excavation.webp);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  ${({ theme }) => {
    return css`
      @media ${theme.breakpoints.up('s')} {
        min-width: 18rem;
      }
    `;
  }}
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(to right, black, transparent);
`;

const StyledContentWrapper = styled(Flex)`
  z-index: 1;
`;

type StyledChipProps = {
  $isFocusVisible: boolean;
};

const StyledChip = styled(Chip)<StyledChipProps>`
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
  cursor: pointer;
`;

export { StyledHarvestCard, StyledChip, StyledOpacityOverlay, StyledContentWrapper };
