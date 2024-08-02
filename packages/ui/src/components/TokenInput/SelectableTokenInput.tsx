import { chain, useId } from '@react-aria/utils';
import { Key, forwardRef, useCallback } from 'react';
import { Currency } from '@gobob/currency';

import { BaseTokenInput, BaseTokenInputProps } from './BaseTokenInput';
import { TokenSelectItemProps, TokenSelect, TokenSelectProps } from './TokenSelect';

type Props = {
  items?: TokenSelectItemProps[];
  onChangeCurrency?: (currency: Currency) => void;
  selectProps?: Omit<TokenSelectProps, 'label' | 'helperTextId' | 'items'>;
};

type InheritAttrs = Omit<BaseTokenInputProps, keyof Props | 'endAdornment'>;

type SelectableTokenInputProps = Props & InheritAttrs;

const SelectableTokenInput = forwardRef<HTMLInputElement, SelectableTokenInputProps>(
  (
    {
      selectProps,
      errorMessage,
      description,
      label,
      balance,
      id,
      isDisabled,
      humanBalance,
      currency,
      items,
      onClickBalance,
      onChangeCurrency,
      ...props
    },
    ref
  ): JSX.Element => {
    const selectHelperTextId = useId();

    const handleSelectionChange = useCallback(
      (ticker: Key) => {
        const item = items?.find((item) => item.currency.symbol === ticker);

        if (item) {
          onChangeCurrency?.(item.currency);
        }
      },
      [items, onChangeCurrency]
    );

    // Prioritise Number Input description and error message
    const hasNumberFieldMessages = !!(errorMessage || description);
    const shouldDisplayHelperText =
      !hasNumberFieldMessages && !!(selectProps?.errorMessage || selectProps?.description);

    const isInvalid = !hasNumberFieldMessages && !!selectProps?.errorMessage;

    const { onSelectionChange, ...restSelectProps } = selectProps || {};

    const endAdornment = (
      <TokenSelect
        {...restSelectProps}
        aria-describedby={shouldDisplayHelperText ? selectHelperTextId : undefined}
        description={undefined}
        errorMessage={undefined}
        isInvalid={isInvalid}
        items={items}
        value={currency?.symbol}
        onSelectionChange={chain(onSelectionChange, handleSelectionChange)}
      />
    );

    return (
      <BaseTokenInput
        ref={ref}
        balance={balance}
        currency={currency}
        description={selectProps?.description || description}
        descriptionProps={selectProps?.description ? { id: selectHelperTextId } : undefined}
        endAdornment={endAdornment}
        errorMessage={selectProps?.errorMessage || errorMessage}
        errorMessageProps={selectProps?.errorMessage ? { id: selectHelperTextId } : undefined}
        humanBalance={humanBalance}
        id={id}
        isDisabled={isDisabled}
        label={label}
        onClickBalance={onClickBalance}
        {...props}
      />
    );
  }
);

SelectableTokenInput.displayName = 'SelectableTokenInput';

export { SelectableTokenInput };
export type { SelectableTokenInputProps };
