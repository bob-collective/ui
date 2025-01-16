import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import React, { Children, cloneElement, ElementType, forwardRef, ReactNode, RefObject } from 'react';

import { useDOMRef } from '../../hooks';

import { usePopoverContext } from './PopoverContext';

type Props = {
  children?: ReactNode;
};

type PopoverTriggerProps = Props;

const PopoverTrigger = forwardRef<HTMLDivElement, PopoverTriggerProps>(({ children }, ref): JSX.Element => {
  const { triggerRef, triggerProps: { onPress, ...triggerAriaProps } = {} } = usePopoverContext();
  const domRef = useDOMRef<HTMLDivElement>(triggerRef as RefObject<HTMLDivElement>);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;

      if (domRef) (domRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref, domRef]
  );

  // MEMO: Ensure tooltip has only one child node
  const child = Children.only(children) as React.ReactElement & {
    ref?: React.Ref<any>;
  };

  const elementType = domRef.current?.tagName.toLowerCase() as ElementType;

  const { buttonProps } = useButton({ onPress, elementType, isDisabled: elementType === 'button' } || {}, mergedRef);

  const triggerProps =
    elementType === 'button'
      ? mergeProps(child.props, triggerAriaProps, { onPress })
      : mergeProps(child.props, triggerAriaProps, buttonProps);

  const trigger = cloneElement(child, mergeProps(triggerProps, { ref: mergedRef }));

  return trigger;
});

PopoverTrigger.displayName = 'PopoverTrigger';

export { PopoverTrigger };
export type { PopoverTriggerProps };
