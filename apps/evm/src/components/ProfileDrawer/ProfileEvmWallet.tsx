'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { ETH } from '@gobob/icons';
import { Card, Flex, Span, Tooltip, UnstyledButton } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { useAccount } from 'wagmi';
import { Trans } from '@lingui/macro';
import { getCapitalizedChainName } from '@gobob/chains';

import { ChainAsset } from '../ChainAsset';
import { CopyAddress } from '../CopyAddress';

import { useBalances } from '@/hooks';
import { L1_CHAIN, L2_CHAIN } from '@/constants';

type ProfileEvmWalletProps = {
  chainId: number;
};

const ProfileEvmWallet = ({ chainId }: ProfileEvmWalletProps): JSX.Element | null => {
  const { getBalance } = useBalances(chainId);
  const { primaryWallet } = useDynamicContext();
  const { address } = useAccount();

  // const { switchChain } = useSwitchChain();

  if (!primaryWallet) return null;

  const otherChain = chainId === L1_CHAIN ? L2_CHAIN : L1_CHAIN;

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
        <Tooltip label={<Trans>Switch to {getCapitalizedChainName(otherChain)}</Trans>}>
          <UnstyledButton>
            <ChainAsset asset={<ETH size='xl' />} chainId={chainId} chainProps={{ size: 'xs' }} />
          </UnstyledButton>
        </Tooltip>
        <Flex direction='column'>
          <Span size='s' weight='semibold'>
            {getBalance('ETH')?.toSignificant()} ETH
          </Span>
          <Flex alignItems='center' gap='s'>
            <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={primaryWallet.connector.key} />
            <CopyAddress
              address={address || ''}
              color='grey-50'
              size='xs'
              truncatedAddress={truncateEthAddress(address || '')}
              weight='semibold'
            />
          </Flex>
        </Flex>
      </Flex>
      {/* <Button onPress={() => switchChain(otherChain)}>
        Switch <ChainLogo chainId={otherChain} />
      </Button> */}
    </Card>
  );
};

export { ProfileEvmWallet };
