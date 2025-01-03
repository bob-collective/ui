/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { Flex, Span, useCurrencyFormatter, useLocale } from '@gobob/ui';
import { Item } from '@react-stately/collections';
import Big from 'big.js';
import { useEffect, useMemo, useState } from 'react';

import { ButtonGroup } from '../ButtonGroup';

const usdItems = [1, 2, 5];

type Props = {
  isSelected: boolean;
  currency: Currency;
  onSelectionChange: (amount: CurrencyAmount<Currency>) => void;
  balance?: CurrencyAmount<Currency>;
};

type HeaderProps = Props;

const TokenButtonGroup = ({ isSelected, currency, balance, onSelectionChange }: HeaderProps): JSX.Element => {
  const { locale } = useLocale();
  const format = useCurrencyFormatter();
  const { getPrice, data: pricesData } = usePrices();

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
          pricesData ? new Big(100000000).mul(usd).div(getPrice(currency.symbol)).round(0, 0).toNumber() : 0
        )
      );
    }

    return usdItems.map((usd) => CurrencyAmount.fromBaseAmount(currency, usd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, pricesData]);

  const disabledKeys = useMemo(() => {
    if (!pricesData) {
      return amounts.map((_, idx) => idx.toString());
    }

    return balance
      ? amounts.reduce(
          (acc, amount, idx) => (amount.greaterThan(balance) ? [...acc, idx.toString()] : acc),
          [] as string[]
        )
      : [];
  }, [amounts, pricesData, balance]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (key: any) => {
    const [selectedKey] = [...key];

    if (!selectedKey) {
      return;
    }

    setKey(selectedKey);

    onSelectionChange(amounts[selectedKey as number] as any);
  };

  return (
    <ButtonGroup
      aria-label='send amount options'
      disabledKeys={disabledKeys}
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
                {format(usdItems[idx] as any)}
              </Span>
            </Flex>
          ) : (
            <Span size='s'>{format(usdItems[idx] as any)}</Span>
          )}
        </Item>
      ))}
    </ButtonGroup>
  );
};

export { TokenButtonGroup };
