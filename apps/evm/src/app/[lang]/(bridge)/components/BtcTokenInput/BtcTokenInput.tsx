import { Bitcoin, CurrencyAmount } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { BITCOIN } from '@gobob/tokens';
import { TokenInput, TokenInputProps } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import Big from 'big.js';
import { useMemo } from 'react';

type Props = {
  amount?: string;
  balance: CurrencyAmount<Bitcoin>;
};

type InheritAttrs = Omit<TokenInputProps, keyof Props>;

type BtcTokenInputProps = Props & InheritAttrs;

const BtcTokenInput = ({ amount, balance, ...props }: BtcTokenInputProps): JSX.Element => {
  const { i18n } = useLingui();
  const { getPrice } = usePrices();

  const btcPrice = getPrice('BTC');

  const valueUSD = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? new Big(amount || 0).mul(btcPrice || 0).toNumber() : 0),
    [amount, btcPrice]
  );

  return (
    <TokenInput
      balance={balance.toExact()}
      balanceHelper={t(
        i18n
      )`Your available balance may differ from your wallet balance due to network fees and available liquidity`}
      currency={BITCOIN}
      label={t(i18n)`Amount`}
      logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
      valueUSD={valueUSD}
      {...props}
    />
  );
};

export { BtcTokenInput };
