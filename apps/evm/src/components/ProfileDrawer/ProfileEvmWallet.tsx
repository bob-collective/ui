'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { ETH } from '@gobob/icons';
import { Card, Flex, Span } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';

import { ChainAsset } from '../ChainAsset';

import { useBalances } from '@/hooks';

type ProfileEvmWalletProps = {
  chainId: number;
};

const ProfileEvmWallet = ({ chainId }: ProfileEvmWalletProps): JSX.Element | null => {
  const { getBalance } = useBalances(chainId);
  const { primaryWallet } = useDynamicContext();

  if (!primaryWallet) return null;

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
        <ChainAsset asset={<ETH size='xl' />} chainId={chainId} chainProps={{ size: 'xs' }} />
        <Flex direction='column'>
          <Span size='s' weight='semibold'>
            {getBalance('ETH')?.toSignificant()} ETH
          </Span>
          <Flex alignItems='center' gap='s'>
            <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={primaryWallet.connector.key} />
            <Span color='grey-50' size='xs' weight='semibold'>
              {truncateEthAddress(primaryWallet.address)}{' '}
            </Span>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export { ProfileEvmWallet };