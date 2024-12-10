'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Card, Cog, Flex, P, Power, QrCode, SolidCreditCard } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { SyledWrapper } from './ProfileDrawer.style';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTag } from './ProfileTag';
import { ProfileTokenList } from './ProfileTokenList';

import { L1_CHAIN } from '@/constants';
import { useBtcAccount, useTotalBalance } from '@/hooks';

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
      <Flex direction='column' flex={1} gap='xl'>
        <Flex direction='column' gap='md'>
          <ProfileEvmWallet chainId={chainId} />
          <ProfileBtcWallet />
        </Flex>
        <ProfileTokenList chainId={chainId} />
      </Flex>
    </SyledWrapper>
  );
};

export { ProfileDrawer };
