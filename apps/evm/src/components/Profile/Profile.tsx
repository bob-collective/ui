'use client';

import { useDisconnect as useSatsDisconnect } from '@gobob/sats-wagmi';
import {
  Button,
  Card,
  Flex,
  P,
  Power,
  Skeleton,
  SolidArrowDownCircle,
  SolidCreditCard,
  Tooltip,
  XMark
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Chain } from 'viem';
import { useDisconnect } from 'wagmi';

import { ProfileTag } from '../ProfileTag';
import { AnimatedAmount } from '../AnimatedAmount';

import { ProfileBtcWallet } from './ProfileBtcWallet';
import { ProfileEvmWallet } from './ProfileEvmWallet';
import { ProfileTokens } from './ProfileTokens';

import { chakraPetch } from '@/app/fonts';
import { useConnectModal, WalletType } from '@/connect-ui';
import { ExternalLinks } from '@/constants';
import { useTotalBalance } from '@/hooks';
import { store } from '@/lib/store';

type ProfileProps = {
  onClose: () => void;
  isMobile: boolean;
  currentChain: Chain;
  otherChain: Chain;
};

const Profile = ({ currentChain, otherChain, onClose, isMobile }: ProfileProps): JSX.Element => {
  const { i18n } = useLingui();

  const { format, amount, isPending: isBalancePending } = useTotalBalance(currentChain.id);
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
        <ProfileTag isCopyEnabled chain={currentChain} labelProps={{ weight: 'semibold' }} size='md' />
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
        <AnimatedAmount
          showAnimation
          amount={amount.toNumber()}
          className={chakraPetch.className}
          format={format}
          size='3xl'
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
      <Flex direction='column' gap='md'>
        <ProfileTokens currentChain={currentChain} otherChain={otherChain} onPressNavigate={onClose} />
      </Flex>
    </Flex>
  );
};

export { Profile };
