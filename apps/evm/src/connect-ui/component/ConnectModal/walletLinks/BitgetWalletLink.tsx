import { Flex, Avatar } from '@gobob/ui';

import { bitgetLogo } from './bitget';

const BitgetWalletLink = () => (
  <Flex alignItems='center' gap='lg'>
    <Avatar rounded='none' src={bitgetLogo} />
    BitgetWallet
  </Flex>
);

export { BitgetWalletLink };
