import { Link, Flex, Avatar } from '@gobob/ui';

import { bitgetLogo } from './bitget';

const BitgetWallet = () => (
  <Link external href='https://web3.bitget.com/en/wallet-download'>
    <Flex alignItems='center' gap='lg' paddingX='xl'>
      <Avatar rounded='none' src={bitgetLogo} />
      BitgetWallet
    </Flex>
  </Link>
);

export { BitgetWallet };
