import { CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import Big from 'big.js';
import { useAccount } from 'wagmi';

import { useBalances } from './useBalances';

import { calculateAmountUSD } from '@/utils';
import { L1_CHAIN, L2_CHAIN } from '@/constants';

const useTotalBalance = () => {
  const { getPrice } = usePrices();
  const { balances: l1Balances, isPending: isEvmL1BalancePending } = useBalances(L1_CHAIN);
  const { balances: l2Balances, isPending: isEvmL2BalancePending } = useBalances(L2_CHAIN);

  const { data: btcBalance, isPending: isBtcBalancePending } = useSatsBalance();
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const format = useCurrencyFormatter();
  const { locale } = useLocale();

  const l1Total = Object.values(l1Balances).reduce(
    (total, balance) => total.plus(calculateAmountUSD(balance, getPrice(balance.currency.symbol) || 0)),
    new Big(0)
  );

  const l2Total = Object.values(l2Balances).reduce(
    (total, balance) => total.plus(calculateAmountUSD(balance, getPrice(balance.currency.symbol) || 0)),
    new Big(0)
  );

  const total = l1Total
    .plus(l2Total)
    .plus(
      new Big(
        calculateAmountUSD(
          CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total.toString() || 0),
          getPrice(BITCOIN.symbol)
        )
      )
    );

  const intlFormat = (balance: number) =>
    Intl.NumberFormat(locale, { notation: 'compact', style: 'currency', currency: 'USD' }).format(balance);

  return {
    isPending:
      (evmAddress ? isEvmL1BalancePending || isEvmL2BalancePending : false) ||
      (btcAddress ? isBtcBalancePending : false),
    formatted: format(total.toNumber()),
    compact: intlFormat(total.toNumber()),
    amount: total,
    format
  };
};

export { useTotalBalance };
