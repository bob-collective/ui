import { Link, Flex } from '@gobob/ui';

import { WalletIcon } from '../../WalletIcon';

const OKXWalletLink = () => (
  <Link external href='https://www.okx.com/web3'>
    <Flex alignItems='center' gap='lg'>
      <WalletIcon name='OKX Wallet' size='xl' />
      OKXWallet
    </Flex>
  </Link>
);

export { OKXWalletLink };
