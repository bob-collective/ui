import { ChainId } from '@gobob/chains';
import { usePrices } from '@gobob/react-query';
import Big from 'big.js';

import { calculateAmountUSD } from '../utils';

import { useBalances } from './useBalances';

const useTotalBalance = (chainId: ChainId) => {
  const { getPrice } = usePrices();

  const { balances } = useBalances(chainId);

  return balances
    ? Object.values(balances).reduce((acc, amount) => {
        return acc.add(calculateAmountUSD(amount, getPrice(amount.currency.symbol)));
      }, new Big(0))
    : undefined;
};

export { useTotalBalance };
