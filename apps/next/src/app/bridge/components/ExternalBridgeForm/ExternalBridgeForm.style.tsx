import { Card } from '@gobob/ui';
import styled from 'styled-components';

type StyledExternalBridgeCardProps = {
  $isDisabled: boolean;
};

const StyledAnchor = styled.a`
  flex: 1;
  text-decoration: none;
`;

const StyledExternalBridgeCard = styled(Card)<StyledExternalBridgeCardProps>`
  opacity: ${({ $isDisabled }) => $isDisabled && '0.5'};
`;

export { StyledAnchor, StyledExternalBridgeCard };
