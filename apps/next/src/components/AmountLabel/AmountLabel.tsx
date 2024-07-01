import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/react-query';
import { useCurrencyFormatter } from '@gobob/ui';
import { useMemo } from 'react';

import { calculateAmountUSD } from '@/utils';

type Props = {
  amount?: CurrencyAmount<Currency>;
};

type AmountLabelProps = Props;

const AmountLabel = ({ amount }: AmountLabelProps): JSX.Element => {
  const format = useCurrencyFormatter();

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API as string });

  const amountUSD = useMemo(
    () => (amount ? calculateAmountUSD(amount, getPrice(amount.currency.symbol)) : undefined),
    [amount, getPrice]
  );

  if (!amount) {
    return <>-</>;
  }

  return (
    <>
      {amount.toExact()} {amount.currency.symbol} ({format(amountUSD || 0)})
    </>
  );
};

export { AmountLabel };
