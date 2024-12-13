import { ChainId } from '@gobob/chains';
import { usePrices } from '@gobob/hooks';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import Big from 'big.js';
import { CurrencyAmount } from '@gobob/currency';
import { BITCOIN } from '@gobob/tokens';

import { useBalances } from './useBalances';
import { useBtcBalance, useBtcDynamicWallet } from './btc';

import { calculateAmountUSD } from '@/utils';

const useTotalBalance = (chainId: ChainId) => {
  const { getPrice } = usePrices();
  const { balances, isPending: isEvmBalancePending } = useBalances(chainId);

  const btcWallet = useBtcDynamicWallet();
  const { data: btcBalance, isPending: isBtcBalancePending } = useBtcBalance();

  const format = useCurrencyFormatter();
  const { locale } = useLocale();

  const total = Object.values(balances).reduce(
    (total, balance) => total.plus(calculateAmountUSD(balance, getPrice(balance.currency.symbol) || 0)),
    new Big(
      calculateAmountUSD(
        CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total.toString() || 0),
        getPrice(BITCOIN.symbol)
      )
    )
  );

  return {
    isPending: isEvmBalancePending || (btcWallet ? isBtcBalancePending : false),
    formatted: format(total.toNumber()),
    compact: Intl.NumberFormat(locale, { notation: 'compact', style: 'currency', currency: 'USD' }).format(
      total.toNumber()
    ),
    amount: total
  };
};

export { useTotalBalance };
