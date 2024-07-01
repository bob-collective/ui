import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/react-query';
import { Card, Dd, Dl, DlProps, Flex, Item, SelectProps, Span, Spinner, TokenData, TokenListItem } from '@gobob/ui';
import { ReactNode, useMemo } from 'react';
import { ChainId } from '@gobob/chains';

import { AmountLabel } from '../AmountLabel';

import { StyledDlGroup, StyledDt, StyledSelect } from './TransactionDetails.style';

import { useBalances, useGasTokens } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type Props = {
  chainId: ChainId;
  gasEstimate?: CurrencyAmount<Currency>;
  gasEstimatePlaceholder?: CurrencyAmount<Currency>;
  isLoadingGasEstimate?: boolean;
  amount?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  amountPlaceholder?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  onChangeGasTicker?: (ticker: string) => void;
  selectProps?: Omit<SelectProps<TokenData>, 'children'>;
  duration?: ReactNode;
  gasLabel?: ReactNode;
};

type InheritAttrs = Omit<DlProps, keyof Props>;

type TransactionDetailsProps = Props & InheritAttrs;

const TransactionDetails = ({
  chainId,
  onChangeGasTicker,
  amount: amountProp,
  amountPlaceholder,
  gasEstimate: gasEstimateProp,
  gasEstimatePlaceholder,
  isLoadingGasEstimate,
  duration,
  selectProps,
  gasLabel = 'Estimated Gas',
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API as any });
  const { getBalance } = useBalances(chainId);
  const { data: gasTokens } = useGasTokens(chainId);

  const gasSelectItems: TokenData[] = useMemo(
    () =>
      gasTokens?.map((token): TokenData => {
        const balance = getBalance(token.currency.symbol);

        return {
          balance: balance?.toExact() || 0,
          balanceUSD: balance ? calculateAmountUSD(balance, getPrice(balance.currency.symbol)) : 0,
          logoUrl: token.raw.logoUrl,
          currency: token.currency
        };
      }) || [],
    [gasTokens, getBalance, getPrice]
  );

  const amount = amountProp || amountPlaceholder;
  const gasEstimate = gasEstimateProp || gasEstimatePlaceholder;

  return (
    <Card background='grey-700'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap alignItems='flex-start' gap='xs' justifyContent='space-between'>
            <StyledDt $hasExtendedHeight={false} size='xs'>
              You will receive
            </StyledDt>
            <Dd>
              {Array.isArray(amount) ? (
                <Flex alignItems='flex-end' direction='column' elementType='span' gap='xxs'>
                  {amount.map((asset) => (
                    <Span key={asset.currency.symbol} size='xs'>
                      <AmountLabel amount={asset} />
                    </Span>
                  ))}
                </Flex>
              ) : (
                <Span size='xs'>
                  <AmountLabel amount={amount} />
                </Span>
              )}
            </Dd>
          </StyledDlGroup>
        )}
        {duration && (
          <StyledDlGroup justifyContent='space-between'>
            <StyledDt size='xs'>Transfer time</StyledDt>
            <Dd size='xs'>{duration}</Dd>
          </StyledDlGroup>
        )}
        {onChangeGasTicker && (
          <Flex alignItems='center' justifyContent='space-between'>
            <Span color='grey-200' size='xs'>
              Gas Token
            </Span>
            <StyledSelect
              aria-label='select gas token'
              items={gasSelectItems}
              modalProps={{ title: 'Select Token' }}
              renderValue={(item) => <Span size='xs'>{item.value?.currency.symbol}</Span>}
              size='s'
              type='modal'
              onSelectionChange={(ticker) => onChangeGasTicker(ticker as string)}
              {...selectProps}
            >
              {(data: TokenData) => (
                <Item key={data.currency.symbol} textValue={data.currency.symbol}>
                  <TokenListItem {...data} />
                </Item>
              )}
            </StyledSelect>
          </Flex>
        )}
        {gasEstimate && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt size='xs'>{gasLabel}</StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingGasEstimate && <Spinner size='12' thickness={2} />}
                <AmountLabel amount={gasEstimate} />
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
      </Dl>
    </Card>
  );
};

export { TransactionDetails };
