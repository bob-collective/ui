import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Card, Flex, H3, Wallet } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Chain } from 'viem';

import { ProfileTokenList } from './ProfileTokenList';
import { ProfileTokenListItem, ProfileTokensListItemSkeleton } from './ProfileTokenListItem';

import { L1_CHAIN, L2_CHAIN, RoutesPath } from '@/constants';
import { useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokensProps = {
  currentChain: Chain;
  otherChain: Chain;
  onPressNavigate?: () => void;
};

const ProfileTokens = ({ currentChain, otherChain, onPressNavigate }: ProfileTokensProps): JSX.Element => {
  const router = useRouter();

  const headerId = useId();

  const { address: btcAddress } = useSatsAccount();

  const { isPending: isl1TokensPending, data: l1Tokens } = useTokens(L1_CHAIN);
  const { isPending: isl2TokensPending, data: l2Tokens } = useTokens(L2_CHAIN);

  const { data: btcBalance } = useSatsBalance();
  const { getPrice } = usePrices();

  const isTokensPending = isl1TokensPending && isl2TokensPending;

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
              logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
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
              items={currentChain.id === L2_CHAIN ? l2Tokens : l1Tokens}
              otherChain={currentChain}
              onPressNavigate={onPressNavigate}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export { ProfileTokens };
