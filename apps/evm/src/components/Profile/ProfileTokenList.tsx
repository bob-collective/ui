import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Card, Flex, H3, Wallet } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { useBalances, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokenListProps = {
  chainId: number;
};

const ProfileTokenList = ({ chainId }: ProfileTokenListProps): JSX.Element => {
  const { i18n } = useLingui();

  const { data: tokens } = useTokens(chainId);
  const { getBalance } = useBalances(chainId);

  const { address: btcAddress } = useSatsAccount();

  const { data: btcBalance } = useSatsBalance();

  const { getPrice } = usePrices();

  const list = tokens
    ?.filter((item) => item.currency.isToken)
    .map((token) => ({ token, balance: getBalance(token.currency.symbol) }));

  const ethData = tokens?.find((item) => item.currency.isNative);
  const ethBalance = ethData && getBalance(ethData.raw.symbol);

  return (
    <Flex direction='column' flex={1}>
      <Card alignItems='center' background='grey-600' direction='row' gap='s' padding='md'>
        <Wallet size='s' />
        <H3 size='lg'>Wallet</H3>
      </Card>
      <Flex aria-label={t(i18n)`erc20 wallet`} direction='column' marginTop='md'>
        {
          (
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
              logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
              name='Bitcoin'
              symbol='BTC'
            /> // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any
        }
        {ethData && (
          <ProfileTokenListItem
            amountUSD={ethBalance ? calculateAmountUSD(ethBalance, getPrice(ethBalance.currency.symbol)) : 0}
            balance={ethBalance?.toSignificant() || 0}
            chainId={chainId}
            logoUrl={ethData.raw.logoUrl}
            name='Ethereum'
            symbol={ethData.currency.symbol}
          />
        )}
        {list?.map(
          (item) =>
            item.balance?.greaterThan(0) && (
              <ProfileTokenListItem
                key={item.token.raw.address}
                amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
                balance={item.balance && item.balance.toSignificant()}
                chainId={chainId}
                currency={item.token.currency as ERC20Token}
                logoUrl={item.token.raw.logoUrl}
                name={item.token.raw.name}
                symbol={item.token.currency.symbol}
              />
            )
        )}
      </Flex>
    </Flex>
  );
};

export { ProfileTokenList };
