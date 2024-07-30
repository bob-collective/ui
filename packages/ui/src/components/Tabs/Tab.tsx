import { useTab } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { HTMLAttributes, ReactNode, useRef } from 'react';
import { mergeProps } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';

import { TabsSize } from '../../theme';

import { StyledTab } from './Tabs.style';

type Props = {
  fullWidth?: boolean;
  size: TabsSize;
};

type AriaProps<T> = {
  item: AriaTabProps & { rendered: ReactNode };
  state: TabListState<T>;
};

type InheritAttrs<T> = Omit<HTMLAttributes<unknown>, keyof (Props & AriaProps<T>)>;

type TabProps<T> = Props & AriaProps<T> & InheritAttrs<T>;

// @internal
const Tab = <T extends Record<string, unknown>>({
  item,
  state,
  fullWidth = false,
  size = 'md',
  ...props
}: TabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps, isDisabled } = useTab(item, state, ref);

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <StyledTab
      {...mergeProps(tabProps, focusProps, props)}
      ref={ref}
      $fullWidth={fullWidth}
      $isDisabled={isDisabled}
      $isFocusVisible={isFocusVisible}
      $size={size}
    >
      {item.rendered}
    </StyledTab>
  );
};

export { Tab };
