import { ChainId } from '@gobob/chains';
import { usePrices } from '@gobob/react-query';
import Big from 'big.js';

import { calculateAmountUSD } from '../utils';

import { useBalances } from './useBalances';

const useTotalBalance = (chainId: ChainId) => {
  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });

  const { erc20Balances } = useBalances(chainId);

  return erc20Balances
    ? Object.values(erc20Balances).reduce((acc, amount) => {
        return acc.add(calculateAmountUSD(amount, getPrice(amount.currency.symbol)));
      }, new Big(0))
    : new Big(0);
};

export { useTotalBalance };
