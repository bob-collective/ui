import { Currency, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { FuelStation } from '@gobob/icons';
import { Flex, Span, useCurrencyFormatter } from '@gobob/ui';

import { calculateAmountUSD } from '@/utils';

type GasAmountProps = {
  amount: CurrencyAmount<Currency>;
};

const GasAmount = ({ amount }: GasAmountProps): JSX.Element => {
  const format = useCurrencyFormatter();
  const { getPrice } = usePrices();

  return (
    <Flex wrap alignItems='center' gap='xs'>
      <Flex alignItems='center' gap='xs'>
        <FuelStation color='grey-50' size='xxs' />
        <Span color='grey-50' lineHeight='1.2' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
          {amount.toSignificant(3)} {amount.currency.symbol}
        </Span>
      </Flex>
      <Span color='grey-50' lineHeight='1.2' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
        ({format(calculateAmountUSD(amount, getPrice(amount.currency.symbol)))})
      </Span>
    </Flex>
  );
};

export { GasAmount };
