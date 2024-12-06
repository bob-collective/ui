'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { BTC } from '@gobob/icons';
import { Button, Card, ChevronRight, Flex, Span } from '@gobob/ui';
import { truncateBtcAddress } from '@gobob/utils';

import { useBtcAccount, useBtcBalance } from '@/hooks';

type ProfileBtcWalletProps = { onPress?: () => void };

const ProfileBtcWallet = ({ onPress }: ProfileBtcWalletProps): JSX.Element | null => {
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
      <Button isIconOnly variant='ghost' onPress={onPress}>
        <ChevronRight color='grey-50' />
      </Button>
    </Card>
  );
};

export { ProfileBtcWallet };
