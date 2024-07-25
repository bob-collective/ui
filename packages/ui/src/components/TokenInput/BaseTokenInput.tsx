import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, FocusEvent, forwardRef, MouseEventHandler, ReactNode, useCallback } from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';

import { useCurrencyFormatter, useDOMRef } from '../../hooks';
import { Spacing } from '../../theme';
import { Label, LabelProps } from '../Label';
import { Flex } from '../Flex';
import { Divider } from '../Divider';
import { BankNotes } from '../../icons';

import { StyledBalanceButton, StyledBaseInput, StyledField, StyledUSDAdornment } from './BaseTokenInput.style';

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
  // TODO: use Currency from bob-ui
  currency?: { symbol: string; decimals: number };
  balance?: string;
  humanBalance?: string | number;
  onClickBalance?: (balance: string) => void;
  onValueChange?: (value: string | number) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<Element>) => void;
  onBlur?: (e: FocusEvent<Element>) => void;
};

// type InheritAttrs = Omit<
//   HelperTextProps &
//     Pick<
//       FieldProps,
//       'label' | 'labelPosition' | 'labelProps' | 'maxWidth' | 'justifyContent' | 'alignItems' | 'fullWidth'
//     >,
//   keyof Props
// >;

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, keyof Props | 'onChange'>;

type BaseTokenInputProps = Props & AriaAttrs;

const BaseTokenInput = forwardRef<HTMLInputElement, BaseTokenInputProps>(
  (
    {
      label,
      placeholder = '0.00',
      balance = '0.00',
      humanBalance,
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
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const format = useCurrencyFormatter();

    const { inputProps, descriptionProps, errorMessageProps, labelProps, isInvalid } = useTextField(
      {
        ...props,
        label,
        inputMode,
        isInvalid: isInvalidProp || !!props.errorMessage,
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

    return (
      <StyledField
        $isDisabled={isDisabled}
        $isFocused={isFocused}
        $isHovered={isHovered}
        $isInvalid={isInvalid}
        direction='column'
        onClick={handleClickWrapper}
        {...mergeProps(hoverProps, focusProps)}
      >
        <Flex alignItems='flex-end'>
          <Flex direction='column' flex={1}>
            {hasLabel && <Label {...labelProps}>{label}</Label>}
            <StyledBaseInput
              ref={inputRef}
              $isInvalid={isInvalid}
              placeholder={placeholder}
              {...mergeProps(inputProps, focusProps, { onChange: handleChange })}
            />
          </Flex>
          {endAdornment}
        </Flex>
        <Divider marginY='s' />
        <Flex gap='md' justifyContent='space-between'>
          <StyledUSDAdornment $isDisabled={isDisabled}>{format(valueUSD)}</StyledUSDAdornment>
          <StyledBalanceButton
            aria-controls={inputProps.id}
            aria-label={typeof label === 'string' ? `apply max ${label}` : 'apply max'}
            color='primary'
            disabled={isDisabled || Number(balance) === 0}
            size='s'
            variant='ghost'
            onPress={() => onClickBalance?.(balance)}
          >
            <BankNotes color='inherit' size='xs' />
            {humanBalance || balance}
          </StyledBalanceButton>
        </Flex>
      </StyledField>
    );
  }
);

BaseTokenInput.displayName = 'BaseTokenInput';

export { BaseTokenInput };
export type { BaseTokenInputProps };
