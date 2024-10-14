import { Card } from '@gobob/ui';
import { styled } from 'styled-components';

type StyledConnectWalletCardProps = {
  $isDisabled?: boolean;
};

const StyledConnectWalletCard = styled(Card)<StyledConnectWalletCardProps>`
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};
`;

export { StyledConnectWalletCard };
