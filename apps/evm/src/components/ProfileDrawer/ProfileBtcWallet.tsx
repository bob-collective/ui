'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { BTC } from '@gobob/icons';
import { Card, Flex, Span } from '@gobob/ui';
import { truncateBtcAddress } from '@gobob/utils';

import { useBtcAccount, useBtcBalance } from '@/hooks';

const ProfileBtcWallet = (): JSX.Element | null => {
  const { data: btcBalance } = useBtcBalance();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();

  if (!btcConnector || !btcAddress) return null;

  return (
    <Card
      alignItems='center'
      background='grey-600'
      direction='row'
      gap='md'
      justifyContent='space-between'
      padding='md'
    >
      <Flex alignItems='center' gap='md'>
        <BTC size='xl' />
        <Flex direction='column'>
          <Span size='s' weight='semibold'>
            {(btcBalance?.total || 0).toString()} BTC
          </Span>
          <Flex alignItems='center' gap='s'>
            <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
            <Span color='grey-50' size='xs' weight='semibold'>
              {truncateBtcAddress(btcAddress)}
            </Span>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export { ProfileBtcWallet };
