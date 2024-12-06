import { Avatar, Flex, P, useCurrencyFormatter } from '@gobob/ui';
import { usePrices } from '@gobob/hooks';
import { CurrencyAmount } from '@gobob/currency';
import { BITCOIN } from '@gobob/tokens';

import { AddornedAsset } from '../AddornedAsset';

import { StyledTransactionList } from './ProfileTokenList.style';

import { useBalances, useBtcBalance, useTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';
import { ChainLogo } from '@/components';

const ProfileTokenListItem = ({
  chainId,
  amountUSD,
  balance,
  logoUrl,
  name,
  symbol
}: {
  chainId?: number;
  name: string;
  logoUrl: string;
  balance: string;
  symbol: string;
  amountUSD: number;
}) => {
  const format = useCurrencyFormatter();

  return (
    <Flex alignItems='center' justifyContent='space-between'>
      <Flex alignItems='center' gap='lg'>
        {chainId ? (
          <AddornedAsset
            addornment={<ChainLogo chainId={chainId} size='xs' />}
            asset={<Avatar alt={name} size='5xl' src={logoUrl} />}
          />
        ) : (
          <Avatar alt={name} size='5xl' src={logoUrl} />
        )}
        <Flex direction='column'>
          <P rows={1}>{name}</P>
          <P color='grey-50' rows={1} size='s'>
            {balance} {symbol} ({format(amountUSD)})
          </P>
        </Flex>
      </Flex>
    </Flex>
  );
};

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
    <StyledTransactionList direction='column' flex={1} gap='xl' paddingX='md' paddingY='xl'>
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
    </StyledTransactionList>
  );
};

export { ProfileTokenList };
