import { Flex, Span, useCurrencyFormatter, useLocale } from '@gobob/ui';
import { Item } from '@react-stately/collections';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/react-query';
import { useEffect, useMemo, useState } from 'react';
import Big from 'big.js';

import { ButtonGroup } from '../ButtonGroup';

const usdItems = [5, 10, 15];

type Props = {
  isSelected: boolean;
  currency: Currency;
  onSelectionChange: (amount: CurrencyAmount<Currency>) => void;
};

type HeaderProps = Props;

const TokenButtonGroup = ({ isSelected, currency, onSelectionChange }: HeaderProps): JSX.Element => {
  const { locale } = useLocale();
  const format = useCurrencyFormatter();
  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });

  const [key, setKey] = useState<string>();

  useEffect(() => {
    if (!isSelected) {
      setKey(undefined);
    }
  }, [isSelected]);

  const amounts = useMemo(() => {
    if (currency.symbol === 'WBTC') {
      return usdItems.map((usd) =>
        CurrencyAmount.fromRawAmount(
          currency,
          new Big(100000000).mul(usd).div(getPrice(currency.symbol)).round(0, 0).toNumber()
        )
      );
    }

    return usdItems.map((usd) => CurrencyAmount.fromBaseAmount(currency, usd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSelectionChange = (key: any) => {
    const [selectedKey] = [...key];

    if (!selectedKey) {
      return;
    }

    setKey(selectedKey);

    onSelectionChange(amounts[selectedKey as number]);
  };

  return (
    <ButtonGroup
      flex={1}
      gap='md'
      justifyContent='space-between'
      marginTop='s'
      selectedKeys={key ? [key] : []}
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
    >
      {amounts.map((amount, idx) => (
        <Item key={idx} textValue={idx.toString()}>
          {currency.symbol === 'WBTC' ? (
            <Flex direction='column'>
              <Span size='s'>{Intl.NumberFormat(locale).format(amount.numerator)}</Span>
              <Span color='grey-200' size='s'>
                {format(usdItems[idx])}
              </Span>
            </Flex>
          ) : (
            <Span size='s'>{format(usdItems[idx])}</Span>
          )}
        </Item>
      ))}

      {/* <Item textValue='1'>
        <Flex direction='column'>
          <Span size='s'>{Intl.NumberFormat(locale).format(16000)}</Span>
          <Span color='grey-200' size='s'>
            {format(10)}
          </Span>
        </Flex>
      </Item>
      <Item textValue='2'>
        <Flex direction='column'>
          <Span size='s'>{Intl.NumberFormat(locale).format(32000)}</Span>
          <Span color='grey-200' size='s'>
            {format(20)}
          </Span>
        </Flex>
      </Item> */}
    </ButtonGroup>
  );
};

export { TokenButtonGroup };