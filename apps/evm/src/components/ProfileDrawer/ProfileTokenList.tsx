import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { BITCOIN } from '@gobob/tokens';
import { Flex, P } from '@gobob/ui';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { useBalances, useBtcBalance, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokenListProps = {
  chainId: number;
};

const ProfileTokenList = ({ chainId }: ProfileTokenListProps): JSX.Element => {
  const { data: tokens } = useTokens(chainId);
  const { getBalance } = useBalances(chainId);
  const { data: btcBalance } = useBtcBalance();

  const { getPrice } = usePrices();

  const list = tokens
    ?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }))
    .filter((item) => item.balance?.greaterThan(0) && item.token.currency.isToken);

  const ethData = tokens?.find((item) => item.currency.isNative);
  const ethBalance = ethData && getBalance(ethData.raw.symbol);

  return (
    <Flex direction='column' flex={1} gap='xl' paddingX='md' paddingY='xl'>
      {ethBalance && ethData && (
        <ProfileTokenListItem
          amountUSD={calculateAmountUSD(ethBalance, getPrice(ethBalance.currency.symbol))}
          balance={ethBalance.toSignificant()}
          logoUrl={ethData.raw.logoUrl}
          name='Ethereum'
          symbol={ethData.currency.symbol}
        />
      )}
      <ProfileTokenListItem
        amountUSD={calculateAmountUSD(CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total || 0), getPrice('BTC'))}
        balance={(btcBalance?.total || 0).toString()}
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        name='Bitcoin'
        symbol='BTC'
      />
      <Flex direction='column' gap='s'>
        <P color='grey-50' size='xs'>
          Tokens
        </P>
        <Flex direction='column' gap='lg'>
          {list?.map((item) => (
            <ProfileTokenListItem
              key={item.token.raw.address}
              amountUSD={calculateAmountUSD(item.balance!, getPrice(item.balance!.currency.symbol))}
              balance={item.balance!.toSignificant()}
              chainId={chainId}
              logoUrl={item.token.raw.logoUrl}
              name={item.token.raw.name}
              symbol={item.token.currency.symbol}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export { ProfileTokenList };
