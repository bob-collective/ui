import { useFocusRing } from '@react-aria/focus';
import { useTab } from '@react-aria/tabs';
import { mergeProps } from '@react-aria/utils';
import { TabListState } from '@react-stately/tabs';
import { AriaTabProps } from '@react-types/tabs';
import { ReactNode, RefObject, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { TabsSize } from '../../theme';
import { Tooltip, TooltipProps } from '../Tooltip';

import { StyledTab } from './Tabs.style';

type Props = {
  tooltipProps?: TooltipProps;
};

type TabsItemProps = Props;

type InternalProps = {
  fullWidth?: boolean;
  size: TabsSize;
  listRef: RefObject<HTMLDivElement>;
};

type AriaProps<T> = {
  item: AriaTabProps & { rendered: ReactNode };
  state: TabListState<T>;
};

type InternalTabProps<T> = TabsItemProps & InternalProps & AriaProps<T>;

// @internal
const Tab = <T extends Record<string, unknown>>({
  item,
  state,
  fullWidth = false,
  size = 'md',
  listRef,
  tooltipProps,
  ...props
}: InternalTabProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabProps, isDisabled } = useTab(item, state, ref);

  const { isFocusVisible, focusProps } = useFocusRing();

  const handleClick = () => {
    if (!ref?.current || !listRef?.current) return;
    scrollIntoView(ref.current, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
      inline: 'end',
      boundary: listRef?.current
    });
  };

  const tab = (
    <StyledTab
      {...mergeProps(tabProps, focusProps, props, { onClick: handleClick })}
      ref={ref}
      $fullWidth={fullWidth}
      $isDisabled={isDisabled}
      $isFocusVisible={isFocusVisible}
      $size={size}
    >
      {item.rendered}
    </StyledTab>
  );

  if (tooltipProps) {
    return <Tooltip {...tooltipProps}>{tab}</Tooltip>;
  }

  return tab;
};

export { Tab };
export type { TabsItemProps };
