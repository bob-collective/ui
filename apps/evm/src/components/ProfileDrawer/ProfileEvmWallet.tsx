'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { ETH } from '@gobob/icons';
import { Button, Card, ChevronRight, Flex, Span } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';

import { ChainLogo } from '../ChainLogo';

import { AddornedAsset } from './AddornedAsset';

import { useBalances } from '@/hooks';

type ProfileEvmWalletProps = {
  chainId: number;
  onPress?: () => void;
};

const ProfileEvmWallet = ({ chainId, onPress }: ProfileEvmWalletProps): JSX.Element | null => {
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
        <AddornedAsset addornment={<ChainLogo chainId={chainId} size='xs' />} asset={<ETH size='xl' />} />
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
      <Button isIconOnly variant='ghost' onPress={onPress}>
        <ChevronRight color='grey-50' />
      </Button>
    </Card>
  );
};

export { ProfileEvmWallet };
