import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledWallets = styled(Flex)`
  > :not(:last-child) {
    // Coin one covers 30% of coin two
    margin-right: -6px;
  }
`;

export { StyledWallets };
