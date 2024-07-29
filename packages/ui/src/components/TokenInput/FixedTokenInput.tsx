import { forwardRef } from 'react';
import { Currency } from '@gobob/currency';

import { BaseTokenInput, BaseTokenInputProps } from './BaseTokenInput';
import { StyledFixedTokenAdornment } from './TokenInput.style';

type Props = {
  logoUrl: string;
  currency: Currency;
};

type InheritAttrs = Omit<BaseTokenInputProps, keyof Props | 'endAdornment'>;

type FixedTokenInputProps = Props & InheritAttrs;

const FixedTokenInput = forwardRef<HTMLInputElement, FixedTokenInputProps>(
  ({ balance, humanBalance, onClickBalance, logoUrl, isDisabled, id, currency, ...props }, ref): JSX.Element => (
    <BaseTokenInput
      {...props}
      ref={ref}
      balance={balance}
      currency={currency}
      endAdornment={<StyledFixedTokenAdornment logoUrl={logoUrl} symbol={currency.symbol} />}
      humanBalance={humanBalance}
      id={id}
      isDisabled={isDisabled}
      onClickBalance={onClickBalance}
    />
  )
);

FixedTokenInput.displayName = 'FixedTokenInput';

export { FixedTokenInput };
export type { FixedTokenInputProps };
