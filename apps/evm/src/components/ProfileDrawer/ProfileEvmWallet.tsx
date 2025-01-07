'use client';

import { getCapitalizedChainName } from '@gobob/chains';
import { ETH } from '@gobob/icons';
import { ArrowPath, Flex, Tooltip, UnstyledButton } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useAccount, useSwitchChain } from 'wagmi';

import { ChainAsset } from '../ChainAsset';

import { ProfileWallet, ProfileWalletProps } from './ProfileWallet';

import { WalletIcon } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { useBalances } from '@/hooks';

type ProfileEvmWalletProps = Pick<ProfileWalletProps, 'onPressConnect' | 'onUnlink'> & {
  chainId: number;
};

const ProfileEvmWallet = ({ chainId, onPressConnect }: ProfileEvmWalletProps): JSX.Element | null => {
  const { getBalance } = useBalances(chainId);
  const { address, connector } = useAccount();

  const { switchChain } = useSwitchChain();

  const otherChain = chainId === L1_CHAIN ? L2_CHAIN : L1_CHAIN;

  const { hoverProps, isHovered } = useHover({ isDisabled: !address });

  return (
    <ProfileWallet
      address={address}
      avatar={
        address ? (
          <Tooltip label={<Trans>Switch to {getCapitalizedChainName(otherChain)}</Trans>}>
            <UnstyledButton {...mergeProps(hoverProps, { onPress: () => switchChain({ chainId: otherChain }) })}>
              <ChainAsset
                asset={
                  <div style={{ position: 'relative' }}>
                    <ETH size='xl' />
                    {isHovered && (
                      <Flex
                        alignItems='center'
                        justifyContent='center'
                        style={{
                          inset: 0,
                          position: 'absolute',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: 99999
                        }}
                      >
                        <ArrowPath size='s' />
                      </Flex>
                    )}
                  </div>
                }
                chainId={isHovered ? otherChain : chainId}
                chainProps={{ size: 'xs' }}
              />
            </UnstyledButton>
          </Tooltip>
        ) : (
          <ETH size='xl' />
        )
      }
      balanceLabel={`${getBalance('ETH')?.toSignificant()} ETH`}
      connectLabel={<Trans>Connect EVM Wallet</Trans>}
      truncatedAddress={truncateEthAddress(address || '')}
      walletAvatar={connector && <WalletIcon name={connector.name} style={{ height: '1rem', width: '1rem' }} />}
      walletId={connector?.id}
      onPressConnect={onPressConnect}
    />
  );
};

export { ProfileEvmWallet };
