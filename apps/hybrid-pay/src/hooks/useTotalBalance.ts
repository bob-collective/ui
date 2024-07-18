import { ChainId } from '@gobob/chains';
import { INTERVAL, usePrices, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';
import Big from 'big.js';

import { calculateAmountUSD } from '../utils';

import { useTokens } from './useTokens';
import { useBalances } from './useBalances';

const useTotalBalance = (chainId: ChainId) => {
  const { address } = useAccount();

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });

  const { erc20Balances } = useBalances(chainId);

  const { data: tokens } = useTokens(chainId);

  return useQuery({
    queryKey: ['total-balances', chainId, address],
    enabled: Boolean(address && erc20Balances && tokens),
    queryFn: async () => {
      if (!erc20Balances) return;

      return Object.values(erc20Balances).reduce((acc, amount) => {
        return acc.add(calculateAmountUSD(amount, getPrice(amount.currency.symbol)));
      }, new Big(0));
    },
    refetchInterval: INTERVAL.MINUTE
  });
};

export { useTotalBalance };
