'use client';

import { Button, Card, Flex, P, Power, QrCode, Skeleton, SolidCreditCard, Tooltip, XMark } from '@gobob/ui';
import { useAccount, useDisconnect } from 'wagmi';
import { useDisconnect as useSatsDisconnect } from '@gobob/sats-wagmi';
import { useLingui } from '@lingui/react';
import { t, Trans } from '@lingui/macro';

import { ProfileTag } from '../ProfileTag';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTokenList } from './ProfileTokenList';

import { chakraPetch } from '@/app/fonts';
import { ExternalLinks, L1_CHAIN } from '@/constants';
import { useTotalBalance } from '@/hooks';
import { store } from '@/lib/store';
import { useConnectModal, WalletType } from '@/connect-ui';

type ProfileProps = {
  onClose: () => void;
  isMobile: boolean;
};

const Profile = ({ onClose, isMobile }: ProfileProps): JSX.Element => {
  const { i18n } = useLingui();
  const { chainId = L1_CHAIN } = useAccount();

  const { formatted, isPending: isBalancePending } = useTotalBalance(chainId);
  const { disconnect: evmWalletDisconnect } = useDisconnect();
  const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
  const { open } = useConnectModal();

  const handleLogout = () => {
    onClose();
    evmWalletDisconnect();
    btcWalletDisconnect();
  };

  const handleConnectEvmWallet = () => {
    open();
    onClose();
  };

  const handleConnectBtcWallet = () => {
    open({ type: WalletType.BTC });
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
        <Flex gap='s'>
          <Tooltip label='Disconnect'>
            <Button
              isIconOnly
              aria-label={t(i18n)`disconnect wallet(s)`}
              size='s'
              variant='ghost'
              onPress={handleLogout}
            >
              <Power size='s' />
            </Button>
          </Tooltip>
          {!isMobile && (
            <Button isIconOnly aria-label={t(i18n)`close drawer`} size='s' variant='ghost' onPress={onClose}>
              <XMark size='s' />
            </Button>
          )}
        </Flex>
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
          <QrCode color='primary-500' />
          <P color='primary-500' weight='bold'>
            <Trans>Receive</Trans>
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

export { Profile };
