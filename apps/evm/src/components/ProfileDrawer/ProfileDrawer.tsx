'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Card, ChevronLeft, Cog, Flex, P, Power, QrCode, SolidCreditCard, Span, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { StyledTabs, SyledWrapper } from './ProfileDrawer.style';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTag } from './ProfileTag';
import { ProfileTokenList } from './ProfileTokenList';

import { L1_CHAIN } from '@/constants';
import { useBtcAccount, useTotalBalance } from '@/hooks';

enum ProfileViews {
  Main = 'main',
  BtcWallet = 'btc-wallet',
  EvmWallet = 'evm-wallet'
}

enum ProfileDrawerTabs {
  Wallet = 'wallet',
  Activity = 'activity'
}

type ProfileDrawerProps = {
  isMobile: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snap: any;
  onClose: () => void;
};

const ProfileDrawer = ({ snap, isMobile, onClose }: ProfileDrawerProps): JSX.Element => {
  const { setShowAuthFlow, user, handleLogOut } = useDynamicContext();
  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useBtcAccount();

  const chainId = chain?.id || L1_CHAIN;

  const { formatted } = useTotalBalance(chainId);

  const [view, setView] = useState(ProfileViews.Main);

  const isAuthenticated = evmAddress || btcAddress;

  if (!isAuthenticated) {
    const handleConnect = () => {
      setShowAuthFlow(true);
    };

    return (
      <Button variant='ghost' onPress={handleConnect}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  const handleLogout = () => {
    handleLogOut();
    onClose();
  };

  const handlePressEvmWallet = () => setView(ProfileViews.EvmWallet);

  const handlePressBtcWallet = () => setView(ProfileViews.BtcWallet);

  const handlePressBack = () => setView(ProfileViews.Main);

  return (
    <SyledWrapper direction='column' flex={1} gap='xl' paddingX='lg' paddingY='md' snap={isMobile ? snap : undefined}>
      <Flex alignItems='center' justifyContent='space-between' padding='s'>
        <ProfileTag btcAddress={btcAddress} evmAddress={evmAddress} size='md' user={user} />
        <Flex>
          <Button isIconOnly aria-label='disconnect wallet(s)' size='s' variant='ghost' onPress={handleLogout}>
            <Cog size='s' />
          </Button>
          <Button isIconOnly aria-label='disconnect wallet(s)' size='s' variant='ghost' onPress={handleLogout}>
            <Power size='s' />
          </Button>
        </Flex>
      </Flex>
      <P size='3xl' weight='bold'>
        {formatted}
      </P>
      <Flex gap='md'>
        <Card isHoverable isPressable flex={1} gap='lg' padding='lg' style={{ backgroundColor: '#3A1F12' }}>
          <SolidCreditCard color='primary-500' />
          <P color='primary-500' weight='bold'>
            Buy
          </P>
        </Card>
        <Card isHoverable isPressable flex={1} gap='lg' padding='lg' style={{ backgroundColor: '#3A1F12' }}>
          <QrCode color='primary-500' />
          <P color='primary-500' weight='bold'>
            Receive
          </P>
        </Card>
      </Flex>
      {view === ProfileViews.Main ? (
        <Flex direction='column' flex={1} gap='xl'>
          <Flex direction='column' gap='md'>
            <ProfileEvmWallet chainId={chainId} onPress={handlePressEvmWallet} />
            <ProfileBtcWallet onPress={handlePressBtcWallet} />
          </Flex>
          <StyledTabs fullWidth size='s'>
            <TabsItem key={ProfileDrawerTabs.Wallet} title={<Trans>Wallet</Trans>}>
              <ProfileTokenList chainId={chainId} />
            </TabsItem>
            <TabsItem key={ProfileDrawerTabs.Activity} title={<Trans>Activity</Trans>}>
              <P>No Activity here</P>
              {/* <TransactionList
                data={transactions}
                isInitialLoading={isTransactionsInitialLoading}
                onProveSuccess={refetchTransaction.bridge}
                onRelaySuccess={refetchTransaction.bridge}
              /> */}
            </TabsItem>
          </StyledTabs>
        </Flex>
      ) : (
        <Flex alignItems='flex-start' direction='column' gap='xl'>
          <Button style={{ padding: '0' }} onPress={handlePressBack}>
            <Flex alignItems='center' elementType='span' gap='xxs'>
              <ChevronLeft size='xs' />
              <Span size='s'>Back</Span>
            </Flex>
          </Button>
          {view === ProfileViews.EvmWallet && <Flex>Evm</Flex>}
          {view === ProfileViews.BtcWallet && <Flex>Btc</Flex>}
        </Flex>
      )}
    </SyledWrapper>
  );
};

export { ProfileDrawer };
