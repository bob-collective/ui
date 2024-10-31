import { Link, Flex } from '@gobob/ui';

import { WalletIcon } from '../../WalletIcon';

const OKXWallet = () => (
  <Link external href='https://www.okx.com/web3'>
    <Flex alignItems='center' gap='lg' paddingX='xl'>
      <WalletIcon name='OKX Wallet' size='xl' />
      OKXWallet
    </Flex>
  </Link>
);

export { OKXWallet };
