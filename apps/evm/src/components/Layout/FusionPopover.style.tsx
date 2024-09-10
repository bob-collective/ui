import styled from 'styled-components';
import { Card, Chip, Flex } from '@gobob/ui';

function getImageUrl(name: string) {
  return new URL(`../../assets/${name}`, import.meta.url).href;
}

const StyledHarvestCard = styled(Card)`
  position: relative;
  background-image: url(${getImageUrl('harvest_excavation.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
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
