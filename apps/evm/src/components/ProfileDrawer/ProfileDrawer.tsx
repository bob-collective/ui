'use client';

import { Button, Card, Flex, P, Power, QrCode, Skeleton, SolidCreditCard, Tooltip } from '@gobob/ui';
import { useAccount, useDisconnect } from 'wagmi';
import { useDisconnect as useSatsDisconnect } from '@gobob/sats-wagmi';

import { ProfileTag } from '../ProfileTag';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTokenList } from './ProfileTokenList';

import { chakraPetch } from '@/app/fonts';
import { ExternalLinks, L1_CHAIN } from '@/constants';
import { useTotalBalance } from '@/hooks';
import { store } from '@/lib/store';
import { useConnectModal } from '@/connect-ui';

type ProfileDrawerProps = {
  onClose: () => void;
};

const ProfileDrawer = ({ onClose }: ProfileDrawerProps): JSX.Element => {
  const { chainId = L1_CHAIN } = useAccount();

  const { formatted, isPending: isBalancePending } = useTotalBalance(chainId);
  const { disconnect } = useDisconnect();
  const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
  const { open } = useConnectModal();

  const handleLogout = () => {
    onClose();
  };

  const handleConnectEvmWallet = () => {
    open();
    onClose();
  };

  const handleConnectBtcWallet = () => {
    open();

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

  const handleUnlinkBtc = async () => {
    btcWalletDisconnect();
  };

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
        <P className={chakraPetch.className} size='3xl' weight='bold'>
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
        <ProfileEvmWallet chainId={chainId} onPressConnect={handleConnectEvmWallet} />
        <ProfileBtcWallet onPressConnect={handleConnectBtcWallet} onUnlink={handleUnlinkBtc} />
      </Flex>
      <Flex direction='column' gap='md'>
        <ProfileTokenList chainId={chainId} />
      </Flex>
    </Flex>
  );
};

export { ProfileDrawer };
