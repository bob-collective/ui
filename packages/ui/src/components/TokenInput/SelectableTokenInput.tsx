import { chain, useId } from '@react-aria/utils';
import { Key, forwardRef, useCallback } from 'react';

import { BaseTokenInput, BaseTokenInputProps } from './BaseTokenInput';
import { TokenData, TokenSelect, TokenSelectProps } from './TokenSelect';

type Props = {
  items?: TokenData[];
  onChangeCurrency?: (currency?: any) => void;
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
        const tokenData = (items as TokenData[]).find((item) => item.currency.symbol === ticker);

        onChangeCurrency?.(tokenData?.currency);
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
        description={description}
        endAdornment={endAdornment}
        errorMessage={errorMessage}
        humanBalance={humanBalance}
        id={id}
        isDisabled={isDisabled}
        label={label}
        onClickBalance={onClickBalance}
        {...props}
      />
      // TODO: need to pass this into base token input
      /* {shouldDisplayHelperText && (
          <HelperText
            description={selectProps?.description}
            errorMessage={selectProps?.errorMessage}
            id={selectHelperTextId}
          />
        )} */
    );
  }
);

SelectableTokenInput.displayName = 'SelectableTokenInput';

export { SelectableTokenInput };
export type { SelectableTokenInputProps };
