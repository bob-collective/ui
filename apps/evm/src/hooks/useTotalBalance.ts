import { ChainId } from '@gobob/chains';
import { usePrices } from '@gobob/hooks';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import Big from 'big.js';
import { useMemo } from 'react';

import { useBalances } from './useBalances';

const useTotalBalance = (chainId: ChainId) => {
  const { getPrice } = usePrices();
  const { balances } = useBalances(chainId);
  const format = useCurrencyFormatter();
  const { locale } = useLocale();

  return useMemo(() => {
    const total = Object.values(balances).reduce(
      (total, balance) => total.plus(new Big(balance.toExact()).mul(getPrice(balance.currency.symbol) || 0).toNumber()),
      new Big(0)
    );

    return {
      formatted: format(total.toNumber()),
      compact: Intl.NumberFormat(locale, { notation: 'compact', style: 'currency', currency: 'USD' }).format(
        total.toNumber()
      ),
      amount: total
    };
  }, [balances, format, getPrice, locale]);
};

export { useTotalBalance };
