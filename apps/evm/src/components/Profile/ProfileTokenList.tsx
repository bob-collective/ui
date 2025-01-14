import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import {
  ArrowLeft,
  Flex,
  H3,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  UnstyledButton,
  Wallet
} from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { TokenData, useBalances, useTokens } from '@/hooks';
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

  const [selectedAsset, setSelectedAsset] = useState<
    | string
    | {
        token: TokenData;
        balance: CurrencyAmount<ERC20Token>;
      }
  >();

  const list = tokens
    ?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }))
    .filter((item) => item.balance?.greaterThan(0) && item.token.currency.isToken);

  const ethData = tokens?.find((item) => item.currency.isNative);
  const ethBalance = ethData && getBalance(ethData.raw.symbol);

  const btcElement = (
    <ProfileTokenListItem
      amountUSD={
        btcAddress
          ? btcBalance && calculateAmountUSD(CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total), getPrice('BTC'))
          : 0
      }
      balance={btcAddress ? btcBalance && CurrencyAmount.fromRawAmount(BITCOIN, btcBalance.total).toSignificant() : 0}
      logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
      name='Bitcoin'
      symbol='BTC'
    />
  );

  const ethElement = ethData && (
    <ProfileTokenListItem
      amountUSD={ethBalance ? calculateAmountUSD(ethBalance, getPrice(ethBalance.currency.symbol)) : 0}
      balance={ethBalance?.toSignificant() || 0}
      chainId={chainId}
      logoUrl={ethData.raw.logoUrl}
      name='Ethereum'
      symbol={ethData.currency.symbol}
    />
  );

  return (
    <Flex direction='column' flex={1}>
      {selectedAsset ? (
        <UnstyledButton onPress={() => setSelectedAsset(undefined)}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='s' />
            <H3 size='lg'>Back</H3>
          </Flex>
        </UnstyledButton>
      ) : (
        <Flex alignItems='center' gap='s'>
          <Wallet size='s' />
          <H3 size='lg'>Wallet</H3>
        </Flex>
      )}
      <Flex
        aria-label={t(i18n)`erc20 wallet`}
        direction='column'
        marginTop='md'
        // selectionMode='single'
        // onSelectionChange={(key) => {
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   const [selectedKey] = [...(key as any)];

        //   if (selectedKey === 'ETH' || selectedKey === 'BTC') {
        //     setSelectedAsset(selectedKey);

        //     return;
        //   }
        // }}
      >
        {
          (
            <Flex key='BTC' alignItems='center' flex={1} justifyContent='space-between' paddingX='xs'>
              {btcElement}
            </Flex> // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any
        }
        <Flex key='ETH' alignItems='center' flex={1} justifyContent='space-between' paddingX='xs'>
          {ethElement}
        </Flex>
        {list?.map((item) => (
          <Popover key={(item.token.currency as ERC20Token)?.address}>
            <PopoverTrigger>
              <Flex alignItems='center' flex={1} justifyContent='space-between' paddingX='xs'>
                <ProfileTokenListItem
                  key={item.token.raw.address}
                  amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
                  balance={item.balance && item.balance.toSignificant()}
                  chainId={chainId}
                  logoUrl={item.token.raw.logoUrl}
                  name={item.token.raw.name}
                  symbol={item.token.currency.symbol}
                />
              </Flex>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>Hello</PopoverBody>
            </PopoverContent>
          </Popover>
        ))}
      </Flex>
    </Flex>
  );
};

export { ProfileTokenList };
