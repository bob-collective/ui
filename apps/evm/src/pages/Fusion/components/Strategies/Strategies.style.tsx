import { Card, Chip } from '@gobob/ui';
import styled from 'styled-components';

import { QuestRefCodes } from '../../../../utils';

type StyledCardProps = {
  $isFeatured?: boolean;
  $questOwner?: QuestRefCodes;
};

const StyledAvatarWrapper = styled(Card)`
  position: relative;
  height: 6.5rem;
`;

const StyledPrize = styled(Chip)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing('xl')};
  left: 50%;
  transform: translateX(-50%);
`;

const StyledCard = styled(Card)<StyledCardProps>`
  position: relative;
`;

export { StyledAvatarWrapper, StyledCard, StyledPrize };
