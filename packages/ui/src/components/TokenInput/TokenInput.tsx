'use client';

import { mergeProps, useId } from '@react-aria/utils';
import { ChangeEvent, FocusEvent, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Currency } from '@gobob/currency';

import { useDOMRef } from '../../hooks';
import { trimDecimals } from '../utils';

import { FixedTokenInput, FixedTokenInputProps } from './FixedTokenInput';
import { SelectableTokenInput, SelectableTokenInputProps } from './SelectableTokenInput';

const getDefaultCurrency = (props: TokenInputProps) => {
  switch (props.type) {
    default:
    case 'fixed':
      return (props as FixedTokenInputProps).currency;
    case 'selectable':
      return (props.items || []).find(
        (item) => item.currency.symbol === (props.selectProps?.value || props.selectProps?.defaultValue)
      )?.currency;
  }
};

type Props = {
  onValueChange?: (value?: string | number) => void;
};

type FixedAttrs = Omit<FixedTokenInputProps, keyof Props>;

type SelectableAttrs = Omit<SelectableTokenInputProps, keyof Props | 'currency'>;

type InheritAttrs = ({ type?: 'fixed' } & FixedAttrs) | ({ type?: 'selectable' } & SelectableAttrs);

type TokenInputProps = Props & InheritAttrs;

// TODO: use address as base value instead of ticker
const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>((props, ref): JSX.Element => {
  const { defaultValue, value: valueProp, onValueChange, balance, onBlur, ...otherProps } = props;

  const inputRef = useDOMRef<HTMLInputElement>(ref);

  const [value, setValue] = useState(defaultValue?.toString());

  const defaultCurrency = useMemo(() => getDefaultCurrency(props), [props]);
  const [currency, setCurrency] = useState<Currency | undefined>(defaultCurrency);
  const [prevCurrency, setPrevCurrency] = useState(currency);

  const inputId = useId();

  useEffect(
    () => {
      if (props.type === 'selectable') {
        setCurrency(
          (props.items || []).find(
            (item) => item.currency.symbol === (props.selectProps?.value || props.selectProps?.defaultValue)
          )?.currency
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    props.type === 'selectable' ? [props.items, props.selectProps?.value, props.selectProps?.defaultValue] : []
  );

  if (prevCurrency !== currency) {
    setPrevCurrency(currency);

    if (value && currency) {
      const trimmedValue = trimDecimals(value, currency.decimals);

      if (value !== trimmedValue) {
        setValue(trimmedValue);
        onValueChange?.(trimmedValue);
      }
    }
  }

  if (value !== valueProp?.toString()) {
    if (valueProp !== undefined) setValue(valueProp);
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      onValueChange?.(value);
      setValue(value);
    },
    [onValueChange]
  );

  const handleClickBalance = useCallback(
    (balance: string) => {
      if (!currency) return;

      inputRef.current?.focus();

      const value = trimDecimals(balance, currency.decimals);

      setValue(value);
      onValueChange?.(value);
    },
    [currency, inputRef, onValueChange]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<Element>) => {
      const relatedTargetEl = e.relatedTarget;

      if (!relatedTargetEl || !relatedTargetEl.getAttribute) {
        return onBlur?.(e);
      }

      const isTargetingMaxBtn = relatedTargetEl.getAttribute('aria-controls') === inputId;

      if (!isTargetingMaxBtn) {
        onBlur?.(e);
      }
    },
    [inputId, onBlur]
  );

  const handleChangeCurrency = useCallback((currency: Currency) => setCurrency(currency), []);

  const numberInputProps: Partial<TokenInputProps> =
    balance !== undefined
      ? {
          id: inputId,
          balance,
          onBlur: handleBlur,
          onClickBalance: handleClickBalance
        }
      : { onBlur };

  const commonProps = {
    ...numberInputProps,
    ref: inputRef,
    value,
    onChange: handleChange
  };

  if (props.type === 'selectable') {
    return (
      <SelectableTokenInput
        {...mergeProps(otherProps, commonProps, { onChangeCurrency: handleChangeCurrency })}
        currency={currency}
      />
    );
  }

  return <FixedTokenInput {...mergeProps(otherProps, commonProps)} currency={currency as Currency} />;
});

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
