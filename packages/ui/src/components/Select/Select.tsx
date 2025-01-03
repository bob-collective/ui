'use client';

import { useSelect, AriaSelectOptions } from '@react-aria/select';
import { mergeProps, useId } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SelectProps as StatelySelectProps, useSelectState } from '@react-stately/select';
import { CollectionBase, Key, Node } from '@react-types/shared';
import { ForwardedRef, ReactNode, forwardRef, useRef } from 'react';

import { useDOMRef } from '../../hooks';
import { InputSizes, Spacing } from '../../theme';
import { HelperText, HelperTextProps } from '../HelperText';

import { SelectModal, SelectModalProps } from './SelectModal';
import { SelectTrigger } from './SelectTrigger';
import { StyledField } from './Select.style';

type SelectObject = Record<any, any>;

type Props<T = SelectObject> = {
  open?: boolean;
  loading?: boolean;
  size?: InputSizes;
  // MEMO: Allows a custom select trigger (TokenInput select)
  asSelectTrigger?: any;
  renderValue?: (item: Node<T>) => ReactNode;
  placeholder?: ReactNode;
  maxWidth?: Spacing;
};

type ListboxAttrs = { type?: 'listbox' };

type ModalAttrs = {
  type?: 'modal';
  modalProps?: { ref?: React.Ref<HTMLDivElement> } & Omit<SelectModalProps, 'state' | 'isOpen' | 'onClose' | 'id'>;
};

type AriaAttrs<T = SelectObject> = Omit<
  CollectionBase<T> & AriaSelectOptions<T> & StatelySelectProps<T>,
  | keyof Props<T>
  | 'isDisabled'
  | 'isLoading'
  | 'isOpen'
  | 'isRequired'
  | 'selectedKey'
  | 'defaultSelectedKey'
  | 'description'
  | 'errorMessage'
>;

type InheritAttrs<T = SelectObject> = Omit<HelperTextProps, (keyof Props<T> & AriaAttrs<T>) | 'children'>;

type NativeAttrs<T = SelectObject> = Omit<React.InputHTMLAttributes<Element>, keyof Props<T> | 'children'>;

type CommonProps<T = SelectObject> = Props<T> & NativeAttrs<T> & InheritAttrs<T> & AriaAttrs<T>;

type ListboxSelectProps<T = SelectObject> = CommonProps<T> & ListboxAttrs;

type ModalSelectProps<T = SelectObject> = CommonProps<T> & ModalAttrs;

type SelectProps<T = SelectObject> = ModalSelectProps<T> | ListboxSelectProps<T>;

// TODO: listbox is not implemented
const Select = <T extends SelectObject = SelectObject>(
  {
    type = 'listbox',
    value,
    defaultValue,
    name,
    disabled,
    open,
    required,
    label,
    description,
    errorMessage,
    size = 'md',
    placeholder = 'Select an option',
    asSelectTrigger,
    isInvalid,
    onChange,
    renderValue = (item) => item.rendered,
    items,
    disabledKeys,
    children,
    className,
    hidden,
    style,
    maxWidth,
    ...props
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element => {
  const inputRef = useDOMRef(ref);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalId = useId();

  const ariaProps: StatelySelectProps<T> = {
    isDisabled: disabled,
    isOpen: open,
    isRequired: required,
    selectedKey: value as Key,
    defaultSelectedKey: defaultValue as Key,
    label,
    errorMessage,
    isInvalid,
    items,
    children,
    ...props
  };

  const state = useSelectState(ariaProps);

  // MEMO: `menuProps` and `triggerProps` not implemented yet
  const { labelProps, valueProps, triggerProps, descriptionProps, errorMessageProps } = useSelect(
    ariaProps,
    state,
    buttonRef
  );

  const error = isInvalid || !!errorMessage;

  const selectTriggerProps =
    type === 'listbox'
      ? triggerProps
      : mergeProps(
          { ...props, modalProps: undefined },
          {
            onPress: () => state.setOpen(true),
            disabled,
            id: triggerProps.id,
            'aria-labelledby': triggerProps['aria-labelledby']
          }
        );

  return (
    <StyledField
      $disabled={disabled}
      $maxWidth={maxWidth}
      className={className}
      direction='column'
      hidden={hidden}
      style={style}
    >
      <VisuallyHidden aria-hidden='true'>
        <input
          ref={inputRef}
          disabled={disabled}
          name={name}
          tabIndex={-1}
          value={onChange ? state.selectedKey?.toString() || '' : undefined}
          onChange={onChange}
        />
      </VisuallyHidden>
      <SelectTrigger
        {...mergeProps(selectTriggerProps)}
        ref={buttonRef}
        aria-controls={modalId}
        aria-expanded={state.isOpen}
        as={asSelectTrigger}
        disabled={disabled}
        hasError={error}
        label={label}
        labelProps={labelProps}
        name={name}
        placeholder={placeholder}
        size={size}
        value={state.selectedKey?.toString()}
        valueProps={valueProps}
      >
        {state.selectedItem && renderValue(state.selectedItem)}
      </SelectTrigger>
      {type === 'modal' && (
        <SelectModal
          {...mergeProps((props as ModalAttrs).modalProps, {
            onClose: state.close
          })}
          id={modalId}
          isOpen={state.isOpen}
          listProps={mergeProps((props as ModalAttrs).modalProps?.listProps, {
            selectedKeys: state.selectedItem?.key ? [state.selectedItem?.key] : [],
            disabledKeys
          })}
          state={state}
        />
      )}
      {(description || errorMessage) && (
        <HelperText
          description={description}
          descriptionProps={descriptionProps}
          errorMessage={errorMessage as ReactNode}
          errorMessageProps={errorMessageProps}
        />
      )}
    </StyledField>
  );
};

const _Select = forwardRef(Select) as <T extends SelectObject = SelectObject>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof Select>;

Select.displayName = 'Select';

export { _Select as Select };
export type { ListboxSelectProps, ModalSelectProps, SelectProps };
