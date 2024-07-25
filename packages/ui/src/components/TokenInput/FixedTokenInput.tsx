import { forwardRef } from 'react';

import { Token } from './Token';
import { BaseTokenInput, BaseTokenInputProps } from './BaseTokenInput';

type Props = {
  logoUrl: string;
  currency: { symbol: string; decimals: number };
};

type InheritAttrs = Omit<BaseTokenInputProps, keyof Props | 'endAdornment'>;

type FixedTokenInputProps = Props & InheritAttrs;

const FixedTokenInput = forwardRef<HTMLInputElement, FixedTokenInputProps>(
  ({ balance, humanBalance, onClickBalance, logoUrl, isDisabled, id, currency, ...props }, ref): JSX.Element => {
    return (
      <BaseTokenInput
        {...props}
        ref={ref}
        balance={balance}
        currency={currency}
        endAdornment={<Token logoUrl={logoUrl} symbol={currency.symbol} />}
        humanBalance={humanBalance}
        id={id}
        isDisabled={isDisabled}
        onClickBalance={onClickBalance}
      />
    );
  }
);

FixedTokenInput.displayName = 'FixedTokenInput';

export { FixedTokenInput };
export type { FixedTokenInputProps };
