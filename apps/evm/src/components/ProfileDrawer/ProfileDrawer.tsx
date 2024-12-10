'use client';

import { useDynamicContext, useDynamicModals } from '@dynamic-labs/sdk-react-core';
import { Button, Card, Flex, P, Power, QrCode, SolidCreditCard } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTag } from './ProfileTag';
import { ProfileTokenList } from './ProfileTokenList';

import { L1_CHAIN } from '@/constants';
import { useBtcAccount, useTotalBalance } from '@/hooks';

type ProfileDrawerProps = {
  onClose: () => void;
};

const ProfileDrawer = ({ onClose }: ProfileDrawerProps): JSX.Element => {
  const { setShowAuthFlow, user, handleLogOut } = useDynamicContext();
  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const { handleUnlinkWallet, setSelectedTabIndex } = useDynamicContext();
  const { setShowLinkNewWalletModal } = useDynamicModals();

  const chainId = chain?.id || L1_CHAIN;

  const { formatted } = useTotalBalance(chainId);

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

  return (
    <Flex direction='column' flex={1} gap='xl'>
      <Flex alignItems='center' justifyContent='space-between' padding='s'>
        <ProfileTag btcAddress={btcAddress} evmAddress={evmAddress} size='md' user={user} />
        <Flex>
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
      <Flex direction='column' flex={1} gap='xl'>
        <Flex direction='column' gap='md'>
          <ProfileEvmWallet chainId={chainId} />
          <ProfileBtcWallet onPressConnect={handleConnectBtcWallet} onUnlink={handleUnlinkWallet} />
        </Flex>
        <ProfileTokenList chainId={chainId} />
      </Flex>
    </Flex>
  );
};

export { ProfileDrawer };
