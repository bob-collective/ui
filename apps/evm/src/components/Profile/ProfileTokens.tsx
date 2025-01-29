import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { BTC } from '@gobob/icons';
import { BITCOIN } from '@gobob/tokens';
import { Flex } from '@gobob/ui';
import { useRouter } from 'next/navigation';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';
import { WalletIcon } from '@dynamic-labs/wallet-book';

import { ChainAsset } from '../ChainAsset';

import { ProfileBlockscoutTokenList } from './ProfileBlockscoutTokenList';
import { ProfileTokenList } from './ProfileTokenList';
import { ProfileTokenListItem, ProfileTokensListItemSkeleton } from './ProfileTokenListItem';

import { L1_CHAIN, L2_CHAIN, RoutesPath } from '@/constants';
import { useBalances, useBtcAccount, useBtcBalance, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokensProps = {
  currentChain: Chain;
  otherChain: Chain;
  onPressNavigate?: () => void;
};

const ProfileTokens = ({ currentChain, otherChain, onPressNavigate }: ProfileTokensProps): JSX.Element => {
  const router = useRouter();

  const { address: evmAddress } = useAccount();

  const { isPending: isl1TokensPending, data: l1Tokens } = useTokens(L1_CHAIN);
  const { isPending: isl2TokensPending, data: l2Tokens } = useTokens(L2_CHAIN);

  const { isPending: isL1BalancesPending } = useBalances(L1_CHAIN);
  const { isPending: isL2BalancesPending } = useBalances(L2_CHAIN);

  const { address: btcAddress, connector: btcConnector } = useBtcAccount();
  const { data: btcBalance, isPending: isSatsBalancePending } = useBtcBalance();

  const { getPrice } = usePrices();

  const isTokensPending =
    (evmAddress && (isl1TokensPending || isl2TokensPending || isL1BalancesPending || isL2BalancesPending)) ||
    (btcAddress && isSatsBalancePending);

  return (
    <Flex direction='column' elementType='ul' flex={1} marginTop='md'>
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
                  btcConnector && <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
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
    </Flex>
  );
};

export { ProfileTokens };
