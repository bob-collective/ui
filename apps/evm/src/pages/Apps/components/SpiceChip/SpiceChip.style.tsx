import { Chip } from '@gobob/ui';
import Lottie from 'lottie-react';
import styled from 'styled-components';

type StyledChipProps = {
  $isPressable?: boolean;
};

const StyledLottie = styled(Lottie)`
  width: 1rem;
  height: 1rem;
  margin-bottom: 0.25rem;
`;

const StyledChip = styled(Chip)<StyledChipProps>`
  cursor: ${({ $isPressable }) => $isPressable && 'pointer'};
`;

export { StyledLottie, StyledChip };
