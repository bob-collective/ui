import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useCurrencyFormatter } from '@gobob/ui';
import { useMemo } from 'react';

import { calculateAmountUSD } from '@/utils';

type Props = {
  amount?: CurrencyAmount<Currency>;
  hidePrice?: boolean;
};

type AmountLabelProps = Props;

const AmountLabel = ({ amount, hidePrice }: AmountLabelProps): JSX.Element => {
  const format = useCurrencyFormatter();

  const { getPrice } = usePrices();

  const amountUSD = useMemo(
    () => (amount && !hidePrice ? calculateAmountUSD(amount, getPrice(amount.currency.symbol)) : undefined),
    [amount, hidePrice, getPrice]
  );

  if (!amount) {
    return <>-</>;
  }

  return (
    <>
      {amount.toExact()} {amount.currency.symbol} {!hidePrice && `(${format(amountUSD || 0)})`}
    </>
  );
};

export { AmountLabel };
