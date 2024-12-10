'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { BTC } from '@gobob/icons';
import { Button, Card, ChevronRight, Flex, LinkSlash, Span, Tooltip } from '@gobob/ui';
import { truncateBtcAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';

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
      <Tooltip label={<Trans>Unlink wallet</Trans>}>
        <Button isIconOnly size='s' variant='ghost' onPress={() => onUnlink(btcWallet.id)}>
          <LinkSlash color='grey-50' size='s' />
        </Button>
      </Tooltip>
    </Card>
  );
};

export { ProfileBtcWallet };
