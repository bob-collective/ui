'use client';

import {
  Button,
  Card,
  ChevronRight,
  Cog,
  Drawer,
  Flex,
  P,
  Power,
  QrCode,
  SolidCreditCard,
  Span,
  Tabs,
  TabsItem
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ETH } from '@gobob/icons';
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { truncateEthAddress } from '@gobob/utils';

import { ChainLogo } from '../ChainLogo';

import { ProfileTag } from './ProfileTag';
import { TransactionList } from './TransactionList';
import { ProfileTokenList } from './ProfileTokenList';
import { AddornedAsset } from './AddornedAsset';

import { useBalances, useBtcAccount, useTotalBalance } from '@/hooks';
import { chainL1, L1_CHAIN } from '@/constants';
import { useGetTransactions } from '@/hooks/useGetTransactions';

enum ProfileDrawerTabs {
  Tokens = 'tokens',
  Activity = 'activity'
}

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileDrawer = ({ isOpen, onClose }: ProfileDrawerProps): JSX.Element => {
  const { setShowAuthFlow, user, handleLogOut } = useDynamicContext();
  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useBtcAccount();

  const chainId = chain?.id || L1_CHAIN;
  const chainName = chain?.name || chainL1.name;

  const { formatted } = useTotalBalance(chainId);

  const { getBalance } = useBalances(chainId);
  const { primaryWallet } = useDynamicContext();

  const {
    data: transactions,
    isInitialLoading: isTransactionsInitialLoading,
    refetch: refetchTransaction
  } = useGetTransactions();

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
    <Drawer isOpen={isOpen} onClose={onClose}>
      <Flex direction='column' gap='xl' paddingX='s'>
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
        {primaryWallet && (
          <Card
            alignItems='center'
            background='grey-600'
            direction='row'
            gap='md'
            justifyContent='space-between'
            padding='md'
          >
            <Flex alignItems='center'>
              <AddornedAsset addornment={<ChainLogo chainId={chainId} size='xs' />} asset={<ETH size='xl' />} />
              <Flex direction='column'>
                <Span size='s'>{getBalance('ETH')?.toSignificant()} ETH</Span>
                <Flex gap='s'>
                  <Span color='grey-50' size='xs'>
                    {truncateEthAddress(primaryWallet.address)}{' '}
                  </Span>
                  <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={primaryWallet?.connector?.key} />
                </Flex>
              </Flex>
            </Flex>
            <ChevronRight />
          </Card>
        )}
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
        <Tabs fullWidth size='s'>
          <TabsItem key={ProfileDrawerTabs.Tokens} title={<Trans>Tokens</Trans>}>
            <ProfileTokenList />
          </TabsItem>
          <TabsItem key={ProfileDrawerTabs.Activity} title={<Trans>Activity</Trans>}>
            <TransactionList
              data={transactions}
              isInitialLoading={isTransactionsInitialLoading}
              onProveSuccess={refetchTransaction.bridge}
              onRelaySuccess={refetchTransaction.bridge}
            />
          </TabsItem>
        </Tabs>
      </Flex>
    </Drawer>
  );
};

export { ProfileDrawer };
