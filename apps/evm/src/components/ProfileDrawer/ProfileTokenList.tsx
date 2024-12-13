import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { BITCOIN } from '@gobob/tokens';
import { Card, Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { useBalances, useBtcBalance, useBtcDynamicWallet, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokenListProps = {
  chainId: number;
};

const ProfileTokenList = ({ chainId }: ProfileTokenListProps): JSX.Element => {
  const { data: tokens } = useTokens(chainId);
  const { getBalance } = useBalances(chainId);

  const btcWallet = useBtcDynamicWallet();

  const { data: btcBalance } = useBtcBalance();

  const { getPrice } = usePrices();

  const list = tokens
    ?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }))
    .filter((item) => item.balance?.greaterThan(0) && item.token.currency.isToken);

  const ethData = tokens?.find((item) => item.currency.isNative);
  const ethBalance = ethData && getBalance(ethData.raw.symbol);

  return (
    <Flex direction='column' flex={1} gap='lg'>
      <Card background='grey-600' padding='s'>
        <P align='center' size='s'>
          <Trans>Wallet</Trans>
        </P>
      </Card>
      {ethBalance && ethData && (
        <ProfileTokenListItem
          amountUSD={calculateAmountUSD(ethBalance, getPrice(ethBalance.currency.symbol))}
          balance={ethBalance.toSignificant()}
          chainId={chainId}
          logoUrl={ethData.raw.logoUrl}
          name='Ethereum'
          symbol={ethData.currency.symbol}
        />
      )}
      <ProfileTokenListItem
        amountUSD={
          btcWallet
            ? btcBalance && calculateAmountUSD(CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total), getPrice('BTC'))
            : 0
        }
        balance={btcWallet ? btcBalance && CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total).toSignificant() : 0}
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        name='Bitcoin'
        symbol='BTC'
      />
      {!!list?.length && (
        <P color='grey-50' size='xs'>
          Tokens
        </P>
      )}
      {list?.map((item) => (
        <ProfileTokenListItem
          key={item.token.raw.address}
          amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
          balance={item.balance && item.balance.toSignificant()}
          chainId={chainId}
          logoUrl={item.token.raw.logoUrl}
          name={item.token.raw.name}
          symbol={item.token.currency.symbol}
        />
      ))}
    </Flex>
  );
};

export { ProfileTokenList };
