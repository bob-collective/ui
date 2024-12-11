'use client';

import { useDynamicContext, useDynamicModals } from '@dynamic-labs/sdk-react-core';
import { Button, Card, Flex, P, Power, QrCode, Skeleton, SolidCreditCard, Tooltip } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { ProfileTag } from '../ProfileTag';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTokenList } from './ProfileTokenList';

import { L1_CHAIN } from '@/constants';
import { useBtcAccount, useTotalBalance } from '@/hooks';
import { store } from '@/lib/store';

type ProfileDrawerProps = {
  onClose: () => void;
};

const ProfileDrawer = ({ onClose }: ProfileDrawerProps): JSX.Element => {
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();
  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const { handleUnlinkWallet, setSelectedTabIndex } = useDynamicContext();
  const { setShowLinkNewWalletModal } = useDynamicModals();

  const chainId = chain?.id || L1_CHAIN;

  const { formatted, isPending: isBalancePending } = useTotalBalance(chainId);

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

  const handleConnectBtcWallet = () => {
    setSelectedTabIndex(2);
    setShowLinkNewWalletModal(true);
    onClose();
  };

  const handlePressBuy = () => {
    window.open('https://checkout.banxa.com/?coinType=ETH&fiatType=EUR&blockchain=BOB', '_blank', 'noreferrer');
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

  return (
    <Flex direction='column' flex={1} gap='xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        <ProfileTag isCopyEnabled labelProps={{ weight: 'semibold' }} size='md' />
        <Tooltip label='Disconnect'>
          <Button isIconOnly aria-label='disconnect wallet(s)' size='s' variant='ghost' onPress={handleLogout}>
            <Power size='s' />
          </Button>
        </Tooltip>
      </Flex>
      {isBalancePending ? (
        <Skeleton height='4xl' width='10rem' />
      ) : (
        <P size='2xl' style={{ fontFamily: 'eurostar' }} weight='bold'>
          {formatted}
        </P>
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
            Buy
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
          <QrCode color='primary-500' />
          <P color='primary-500' weight='bold'>
            Receive
          </P>
        </Card>
      </Flex>
      <Flex direction='column' gap='md'>
        <ProfileEvmWallet chainId={chainId} />
        <ProfileBtcWallet onPressConnect={handleConnectBtcWallet} onUnlink={handleUnlinkWallet} />
      </Flex>
      <Flex direction='column' gap='md'>
        <ProfileTokenList chainId={chainId} />
      </Flex>
    </Flex>
  );
};

export { ProfileDrawer };
