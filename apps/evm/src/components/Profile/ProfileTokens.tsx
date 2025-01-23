import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { BTC } from '@gobob/icons';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Card, Flex, H3, Wallet } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

import { ChainAsset } from '../ChainAsset';

import { ProfileTokenList } from './ProfileTokenList';
import { ProfileTokenListItem, ProfileTokensListItemSkeleton } from './ProfileTokenListItem';
import { ProfileBlockscoutTokenList } from './ProfileBlockscoutTokenList';

import { WalletIcon } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN, RoutesPath } from '@/constants';
import { useBalances, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokensProps = {
  currentChain: Chain;
  otherChain: Chain;
  onPressNavigate?: () => void;
};

const ProfileTokens = ({ currentChain, otherChain, onPressNavigate }: ProfileTokensProps): JSX.Element => {
  const router = useRouter();

  const headerId = useId();

  const { address: evmAddress } = useAccount();

  const { isPending: isl1TokensPending, data: l1Tokens } = useTokens(L1_CHAIN);
  const { isPending: isl2TokensPending, data: l2Tokens } = useTokens(L2_CHAIN);

  const { isPending: isL1BalancesPending } = useBalances(L1_CHAIN);
  const { isPending: isL2BalancesPending } = useBalances(L2_CHAIN);

  const { address: btcAddress, connector: btcConnector } = useSatsAccount();
  const { data: btcBalance, isPending: isSatsBalancePending } = useSatsBalance();

  const { getPrice } = usePrices();

  const isTokensPending =
    (evmAddress && (isl1TokensPending || isl2TokensPending || isL1BalancesPending || isL2BalancesPending)) ||
    (btcAddress && isSatsBalancePending);

  return (
    <Flex direction='column' flex={1}>
      <Card alignItems='center' background='grey-600' direction='row' gap='s' padding='md'>
        <Wallet size='s' />
        <H3 id={headerId} size='md'>
          <Trans>Tokens</Trans>
        </H3>
      </Card>
      <Flex aria-labelledby={headerId} direction='column' elementType='ul' marginTop='md'>
        {isTokensPending ? (
          Array(8)
            .fill(undefined)
            .map((_, idx) => <ProfileTokensListItemSkeleton key={idx} />)
        ) : (
          <>
            <ProfileTokenListItem
              amountUSD={
                btcAddress
                  ? btcBalance &&
                    calculateAmountUSD(CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total), getPrice('BTC'))
                  : 0
              }
              balance={
                btcAddress ? btcBalance && CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total).toSignificant() : 0
              }
              currency={BITCOIN}
              logo={
                <ChainAsset
                  asset={<BTC size='2xl' />}
                  chainLogo={
                    btcConnector && <WalletIcon name={btcConnector.name} style={{ height: '1rem', width: '1rem' }} />
                  }
                />
              }
              name='Bitcoin'
              onPressBridge={() => {
                router.push(`${RoutesPath.BRIDGE}?type=deposit&network=bitcoin`);
                onPressNavigate?.();
              }}
              onPressStake={() => {
                router.push(RoutesPath.STRATEGIES);
                onPressNavigate?.();
              }}
            />
            {evmAddress && (
              <>
                <ProfileTokenList
                  currentChain={currentChain}
                  items={currentChain.id === L1_CHAIN ? l1Tokens : l2Tokens}
                  otherChain={otherChain}
                  onPressNavigate={onPressNavigate}
                />
                <ProfileTokenList
                  currentChain={otherChain}
                  items={currentChain.id === L1_CHAIN ? l2Tokens : l1Tokens}
                  otherChain={currentChain}
                  onPressNavigate={onPressNavigate}
                />
                {!isTokensPending && <ProfileBlockscoutTokenList />}
              </>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export { ProfileTokens };
