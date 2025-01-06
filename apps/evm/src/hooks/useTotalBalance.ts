import { ChainId } from '@gobob/chains';
import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import Big from 'big.js';
import { useAccount } from 'wagmi';

import { useBalances } from './useBalances';

import { calculateAmountUSD } from '@/utils';

const useTotalBalance = (chainId: ChainId) => {
  const { getPrice } = usePrices();
  const { balances, isPending: isEvmBalancePending } = useBalances(chainId);

  const { data: btcBalance, isPending: isBtcBalancePending } = useSatsBalance();
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();

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
    isPending: (evmAddress ? isEvmBalancePending : false) || (btcAddress ? isBtcBalancePending : false),
    formatted: format(total.toNumber()),
    compact: Intl.NumberFormat(locale, { notation: 'compact', style: 'currency', currency: 'USD' }).format(
      total.toNumber()
    ),
    amount: total
  };
};

export { useTotalBalance };
