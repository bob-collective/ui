'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { BTC } from '@gobob/icons';
import { Button, Card, ChevronRight, Flex, LinkSlash, Span, Spinner, Tooltip } from '@gobob/ui';
import { truncateBtcAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import { CurrencyAmount } from '@gobob/currency';
import { BITCOIN } from '@gobob/tokens';
import { useState } from 'react';

import { CopyAddress } from '../CopyAddress';

import { StyledWalletCard } from './ProfileDrawer.style';

import { useBtcAccount, useBtcBalance, useBtcDynamicWallet } from '@/hooks';

type ProfileBtcWalletProps = {
  onPressConnect: () => void;
  onUnlink: (id: string) => void;
};

const ProfileBtcWallet = ({ onPressConnect, onUnlink }: ProfileBtcWalletProps): JSX.Element | null => {
  const { data: btcBalance } = useBtcBalance();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();
  const btcWallet = useBtcDynamicWallet();

  const [prevBtcWallet, setPrevBtcWallet] = useState<string | undefined>(btcWallet?.id);
  const [isDisconnecting, setDisconnecting] = useState(false);

  if (btcWallet && btcWallet?.id !== prevBtcWallet) {
    setPrevBtcWallet(btcWallet?.id);
    setDisconnecting(false);
  }

  if (!btcConnector || !btcAddress || !btcWallet) {
    return (
      <StyledWalletCard
        isHoverable
        isPressable
        alignItems='center'
        background='grey-600'
        direction='row'
        gap='md'
        justifyContent='space-between'
        padding='md'
        onPress={onPressConnect}
      >
        <Flex alignItems='center' gap='md'>
          <BTC size='xl' />
          <Span size='s' weight='semibold'>
            <Trans>Connect BTC Wallet</Trans>
          </Span>
        </Flex>
        <ChevronRight color='grey-50' />
      </StyledWalletCard>
    );
  }

  const handleUnlink = () => {
    onUnlink(btcWallet.id);
    setDisconnecting(true);
  };

  return (
    <Card
      key={btcWallet.id}
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
            {CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total || 0).toSignificant()} BTC
          </Span>
          <Flex alignItems='center' gap='s'>
            <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
            <CopyAddress
              address={btcAddress || ''}
              color='grey-50'
              size='xs'
              truncatedAddress={truncateBtcAddress(btcAddress || '')}
              weight='semibold'
            />
          </Flex>
        </Flex>
      </Flex>
      <Tooltip label={<Trans>Unlink wallet</Trans>}>
        <Button isIconOnly size='s' variant='ghost' onPress={handleUnlink}>
          {isDisconnecting ? <Spinner size='s' /> : <LinkSlash color='grey-50' size='s' />}
        </Button>
      </Tooltip>
    </Card>
  );
};

export { ProfileBtcWallet };
