import { Flex, Avatar } from '@gobob/ui';

import { bitgetLogo } from './bitget';

const BitgetWalletLink = () => (
  // <Link external href='https://web3.bitget.com/en/wallet-download'>
  <Flex alignItems='center' gap='lg'>
    <Avatar rounded='none' src={bitgetLogo} />
    BitgetWallet
  </Flex>
  // </Link>
);

export { BitgetWalletLink };
