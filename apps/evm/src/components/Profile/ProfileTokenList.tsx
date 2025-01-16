import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Card, Flex, H3, Wallet } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRouter } from 'next/navigation';
import { Address } from 'viem';
import { useAccount, useWatchAsset } from 'wagmi';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { RoutesPath } from '@/constants';
import { useBalances, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokenListProps = {
  chainId: number;
  onPressNavigate?: () => void;
};

const ProfileTokenList = ({ chainId, onPressNavigate }: ProfileTokenListProps): JSX.Element => {
  const { i18n } = useLingui();
  const router = useRouter();

  const { watchAsset } = useWatchAsset();
  const { data: tokens } = useTokens(chainId);
  const { getBalance } = useBalances(chainId);
  const { chain } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const { data: btcBalance } = useSatsBalance();

  const { getPrice } = usePrices();

  const list = tokens
    ?.filter((item) => item.currency.isToken)
    .map((token) => ({ token, balance: getBalance(token.currency.symbol) }));

  const ethData = tokens?.find((item) => item.currency.isNative);
  const ethBalance = ethData && getBalance(ethData.raw.symbol);

  const handlePressExplorer = (address: Address) => {
    window.open(`${chain?.blockExplorers?.default.url}/address/${address}`, '_blank', 'noreferrer');
  };

  return (
    <Flex direction='column' flex={1}>
      <Card alignItems='center' background='grey-600' direction='row' gap='s' padding='md'>
        <Wallet size='s' />
        <H3 size='lg'>Wallet</H3>
      </Card>
      <Flex aria-label={t(i18n)`erc20 wallet`} direction='column' marginTop='md'>
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
              router.push(RoutesPath.STAKE);
              onPressNavigate?.();
            }}
          />
          {ethData && (
            <ProfileTokenListItem
              amountUSD={ethBalance ? calculateAmountUSD(ethBalance, getPrice(ethBalance.currency.symbol)) : 0}
              balance={ethBalance?.toSignificant() || 0}
              chainId={chainId}
              currency={ethData.currency}
              logoUrl={ethData.raw.logoUrl}
              name='Ethereum'
              onPressBridge={() => {
                router.push(`${RoutesPath.BRIDGE}?type=deposit&network=ethereum`);
                onPressNavigate?.();
              }}
            />
          )}
        </>
        {list?.map((item) => {
          if (!item.balance?.greaterThan(0)) {
            return undefined;
          }

          const handlePressBridge = () => {
            () => {
              router.push(`${RoutesPath.BRIDGE}?type=deposit&network=ethereum&receive=${item.token.currency.symbol}`);
              onPressNavigate?.();
            };
          };

          const handlePressAddErc20 = (currency: ERC20Token) => {
            watchAsset({
              type: 'ERC20',
              options: { address: currency.address, decimals: currency.decimals, symbol: currency.symbol }
            });
          };

          return (
            <ProfileTokenListItem
              key={item.token.raw.address}
              amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
              balance={item.balance && item.balance.toSignificant()}
              chainId={chainId}
              currency={item.token.currency}
              logoUrl={item.token.raw.logoUrl}
              name={item.token.raw.name}
              onPressAddErc20={handlePressAddErc20}
              onPressBridge={handlePressBridge}
              onPressExplorer={handlePressExplorer}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export { ProfileTokenList };
