'use client';

import { useDynamicContext, useDynamicModals, useSwitchWallet } from '@dynamic-labs/sdk-react-core';
import { Card, Flex, P, Skeleton, SolidArrowDownCircle, SolidCreditCard, Spinner, Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { Key } from 'react';
import { Chain } from 'viem';

import { AnimatedAmount } from '../AnimatedAmount';
import { ProfileActivity } from '../ProfileActivity';
import { ProfileTag } from '../ProfileTag';

import { DisconnectButton } from './DisconnectButton';
import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTokens } from './ProfileTokens';

import { chakraPetch } from '@/app/fonts';
import { ExternalLinks } from '@/constants';
import { useDynamicWallets, useGetBridgeTransactions, useTotalBalance } from '@/hooks';
import { ShareStoreProfileTabs, store } from '@/lib/store';

type ProfileProps = {
  onClose: () => void;
  currentChain: Chain;
  otherChain: Chain;
  hasOpenned?: boolean;
};

const Profile = ({ currentChain, otherChain, hasOpenned, onClose }: ProfileProps): JSX.Element => {
  const { handleUnlinkWallet, setSelectedTabIndex, handleLogOut, primaryWallet } = useDynamicContext();
  const switchWallet = useSwitchWallet();
  const { setShowLinkNewWalletModal } = useDynamicModals();
  const { evmWallet } = useDynamicWallets();

  const { amount, format, isPending: isBalancePending } = useTotalBalance();

  const { selectedTab } = useStore(store, (state) => state.shared.profile);

  const { txPendingUserAction } = useGetBridgeTransactions();

  const handleLogout = () => {
    setSelectedTabIndex(0);
    handleLogOut();
    onClose();
  };

  const handleConnectEvmWallet = () => {
    setSelectedTabIndex(1);
    setShowLinkNewWalletModal(true);
    onClose();
  };

  const handleConnectBtcWallet = () => {
    setSelectedTabIndex(2);
    setShowLinkNewWalletModal(true);
    onClose();
  };

  const handlePressBuy = () => {
    window.open(ExternalLinks.BANXA, '_blank', 'noreferrer');

    onClose();
  };

  const handlePressReceive = () =>
    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        isReceiveModalOpen: true
      }
    }));

  const handleUnlinkBtc = async (walletId: string) => {
    if (!evmWallet || !primaryWallet) return;

    if (walletId === primaryWallet?.id) {
      await switchWallet(evmWallet.id);
    }

    handleUnlinkWallet(walletId);
  };

  const handleTabsSelectionChange = (key: Key) =>
    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        profile: { ...state.shared.profile, selectedTab: key as ShareStoreProfileTabs }
      }
    }));

  return (
    <Flex direction='column' flex={1} gap='xl' style={{ height: '100%' }}>
      <Flex alignItems='center' justifyContent='space-between'>
        <ProfileTag isCopyEnabled chain={currentChain} labelProps={{ weight: 'semibold' }} size='md' />
        <DisconnectButton onConfirmPress={handleLogout} />
      </Flex>
      {isBalancePending ? (
        <Skeleton height='4xl' width='10rem' />
      ) : (
        <AnimatedAmount
          showAnimation
          amount={amount.toNumber()}
          className={chakraPetch.className}
          format={format}
          size='3xl'
          start={hasOpenned ? amount.toNumber() : undefined}
          weight='bold'
        />
      )}
      <Flex gap='md'>
        <Card
          isHoverable
          isPressable
          flex={1}
          gap='lg'
          padding='lg'
          style={{ backgroundColor: '#3A1F12' }}
          onPress={handlePressBuy}
        >
          <SolidCreditCard color='primary-500' />
          <P color='primary-500' weight='bold'>
            <Trans>Buy</Trans>
          </P>
        </Card>
        <Card
          isHoverable
          isPressable
          flex={1}
          gap='lg'
          padding='lg'
          style={{ backgroundColor: '#3A1F12' }}
          onPress={handlePressReceive}
        >
          <SolidArrowDownCircle color='primary-500' />
          <P color='primary-500' weight='bold'>
            <Trans>Receive</Trans>
          </P>
        </Card>
      </Flex>
      <Flex direction='column' gap='md'>
        <ProfileEvmWallet currentChain={currentChain} otherChain={otherChain} onPressConnect={handleConnectEvmWallet} />
        <ProfileBtcWallet onPressConnect={handleConnectBtcWallet} onUnlink={handleUnlinkBtc} />
      </Flex>
      <Tabs fullHeight fullWidth selectedKey={selectedTab} size='s' onSelectionChange={handleTabsSelectionChange}>
        <TabsItem key={ShareStoreProfileTabs.WALLET} title={<Trans>Wallet</Trans>}>
          <ProfileTokens currentChain={currentChain} otherChain={otherChain} onPressNavigate={onClose} />
        </TabsItem>
        <TabsItem
          key={ShareStoreProfileTabs.ACTIVITY}
          title={
            <Flex alignItems='center' elementType='span' gap='s'>
              <Trans>Activity</Trans>
              {!!txPendingUserAction && txPendingUserAction > 0 && <Spinner color='default' size='16' thickness={2} />}
            </Flex>
          }
        >
          <ProfileActivity />
        </TabsItem>
      </Tabs>
    </Flex>
  );
};

export { Profile };
