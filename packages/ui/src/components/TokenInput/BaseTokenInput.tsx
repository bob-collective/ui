import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import React, { ChangeEventHandler, FocusEvent, forwardRef, MouseEventHandler, ReactNode, useCallback } from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { Currency } from '@gobob/currency';

import { useCurrencyFormatter, useDOMRef } from '../../hooks';
import { Spacing } from '../../theme';
import { Label, LabelProps } from '../Label';
import { Flex } from '../Flex';
import { BankNotes } from '../../icons';
import { Span } from '../Text';
import { HelperText, HelperTextProps } from '../HelperText';
import { Tooltip } from '../Tooltip';

import {
  StyledBalanceButton,
  StyledBaseInput,
  StyledBaseTokenInputWrapper,
  StyledBottomWrapper,
  StyledDivider,
  StyledInputWrapper,
  StyledUSDAdornment
} from './TokenInput.style';

const escapeRegExp = (string: string): string => {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const hasCorrectDecimals = (value: string, decimals: number) => {
  const decimalGroups = value.split('.');

  return decimalGroups.length > 1 ? decimalGroups[1].length <= decimals : true;
};

type Props = {
  valueUSD?: number;
  label?: ReactNode;
  labelProps?: LabelProps;
  endAdornment: ReactNode;
  isInvalid?: boolean;
  minHeight?: Spacing;
  value?: string;
  defaultValue?: string;
  currency?: Currency;
  balance?: string;
  balanceHelper?: ReactNode;
  humanBalance?: string | number;
  onClickBalance?: (balance: string) => void;
  onValueChange?: (value: string | number) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<Element>) => void;
  onBlur?: (e: FocusEvent<Element>) => void;
};

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, keyof Props | 'onChange' | 'errorMessage' | 'description'>;

type InheritAttrs = Omit<HelperTextProps, keyof (Props & AriaAttrs)>;

type BaseTokenInputProps = Props & InheritAttrs & AriaAttrs;

const BaseTokenInput = forwardRef<HTMLInputElement, BaseTokenInputProps>(
  (
    {
      label,
      placeholder = '0.00',
      balance = '0.00',
      humanBalance,
      balanceHelper,
      onClickBalance,
      valueUSD = 0,
      isDisabled,
      isInvalid: isInvalidProp,
      defaultValue,
      inputMode,
      value = '',
      endAdornment,
      currency,
      onChange,
      onValueChange,
      description,
      errorMessage,
      descriptionProps: descriptionPropsProp,
      errorMessageProps: errorMessagePropsProp,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const format = useCurrencyFormatter();

    const { inputProps, descriptionProps, errorMessageProps, labelProps, isInvalid } = useTextField<'input'>(
      {
        ...props,
        errorMessage,
        description,
        label,
        inputMode,
        isInvalid: isInvalidProp || !!errorMessage,
        value,
        onChange: () => {},
        defaultValue,
        placeholder,
        autoComplete: 'off'
      },
      inputRef
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        const value = e.target.value;

        const isEmpty = value === '';
        const hasValidDecimalFormat = RegExp(`^\\d*(?:\\\\[.])?\\d*$`).test(escapeRegExp(value));
        const hasValidDecimalsAmount = currency ? hasCorrectDecimals(value, currency.decimals) : true;

        const isValid = hasValidDecimalFormat && hasValidDecimalsAmount;

        if (isEmpty || isValid) {
          onChange?.(e);
          onValueChange?.(value);
        }
      },
      [onChange, onValueChange, currency]
    );

    const handleClickWrapper: MouseEventHandler<unknown> = (e) => {
      if (inputRef.current && e.currentTarget === e.target) {
        inputRef.current.focus();
      }
    };

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { isFocused, focusProps } = useFocusRing({
      autoFocus: inputProps.autoFocus,
      isTextInput: true
    });

    const hasLabel = !!label || !!balance;

    const isBalanceDisabled = !currency || isDisabled || Number(balance) === 0;

    const hasHelpText = !!description || !!errorMessage;

    return (
      <Flex direction='column'>
        <StyledBaseTokenInputWrapper
          $isDisabled={isDisabled}
          $isFocused={isFocused}
          $isHovered={isHovered}
          $isInvalid={isInvalid}
          direction='column'
        >
          <StyledInputWrapper alignItems='flex-end' onClick={handleClickWrapper}>
            <Flex direction='column' flex={1} onClick={handleClickWrapper} {...mergeProps(hoverProps, focusProps)}>
              {hasLabel && <Label {...labelProps}>{label}</Label>}
              <StyledBaseInput
                ref={inputRef}
                $isInvalid={isInvalid}
                placeholder={placeholder}
                {...mergeProps(inputProps, focusProps, { onChange: handleChange })}
              />
            </Flex>
            {endAdornment}
          </StyledInputWrapper>
          <StyledDivider />
          <StyledBottomWrapper gap='md' justifyContent='space-between'>
            <StyledUSDAdornment>{format(valueUSD)}</StyledUSDAdornment>
            <Tooltip isDisabled={!balanceHelper} label={balanceHelper}>
              <StyledBalanceButton
                aria-controls={inputProps.id}
                aria-label={`apply ${balance}${currency ? ` ${currency.symbol}` : ''} ${typeof label === 'string' ? ` to ${label}` : ''}`}
                color='primary'
                disabled={isBalanceDisabled}
                size='s'
                variant='ghost'
                onPress={() => onClickBalance?.(balance)}
              >
                <BankNotes color='inherit' size='xs' />
                <Span color='inherit' lineHeight='normal'>
                  {isBalanceDisabled ? 0 : humanBalance || balance}
                </Span>
              </StyledBalanceButton>
            </Tooltip>
          </StyledBottomWrapper>
        </StyledBaseTokenInputWrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            descriptionProps={descriptionPropsProp || descriptionProps}
            errorMessage={errorMessage}
            errorMessageProps={errorMessagePropsProp || errorMessageProps}
          />
        )}
      </Flex>
    );
  }
);

BaseTokenInput.displayName = 'BaseTokenInput';

export { BaseTokenInput };
export type { BaseTokenInputProps };
