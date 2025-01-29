'use client';

import { useFocusRing } from '@react-aria/focus';
import { useTabList } from '@react-aria/tabs';
import { useTabListState } from '@react-stately/tabs';
import { CollectionChildren, Key } from '@react-types/shared';
import { HTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { useFocusWithin, useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';

import { useDOMRef } from '../../hooks';
import { AlignItems, TabsSize, TabsVariant } from '../../theme';

import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { StyledTabs, TabList, TabSelection } from './Tabs.style';

type Props = {
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (index: Key) => void;
  disabledKeys?: Key[];
  panel?: React.ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
  size?: TabsSize;
  align?: AlignItems;
  variant?: TabsVariant;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      className,
      style,
      panel,
      fullWidth = false,
      fullHeight = false,
      size = 'md',
      align = 'flex-start',
      variant = 'solid',
      ...props
    },
    ref
  ): JSX.Element => {
    const ariaProps = { children: children as CollectionChildren<Record<string, unknown>>, ...props };
    const state = useTabListState(ariaProps);
    const tabsListRef = useDOMRef<HTMLDivElement>(ref);
    const { tabListProps } = useTabList(ariaProps, state, tabsListRef);

    const [activeTabStyle, setActiveTabStyle] = useState({
      width: 0,
      transform: 'translateX(0)'
    });

    const { hoverProps, isHovered } = useHover({});

    useEffect(() => {
      const activeTab = tabsListRef.current?.querySelector<HTMLDivElement>('[role="tab"][aria-selected="true"]');

      if (!activeTab) return;

      setActiveTabStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab?.offsetLeft}px)`
      });
    }, [state.selectedKey, tabsListRef]);

    const { focusProps: focusRingProps } = useFocusRing({
      within: true
    });

    let [isFocusWithin, setFocusWithin] = useState(false);
    const { focusWithinProps } = useFocusWithin({
      onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin)
    });

    return (
      <StyledTabs $fullHeight={fullHeight} className={className} style={style}>
        <TabList
          ref={tabsListRef}
          $align={align}
          $fullWidth={fullWidth}
          $size={size}
          $variant={variant}
          {...mergeProps(tabListProps, focusRingProps, focusWithinProps)}
        >
          <TabSelection
            $isFocusWithin={isFocusWithin}
            $isHovered={isHovered}
            $size={size}
            $transform={activeTabStyle.transform}
            $variant={variant}
            $width={activeTabStyle.width}
          />
          {[...state.collection].map((item) => (
            <Tab
              key={item.key}
              fullWidth={fullWidth}
              item={item}
              listRef={tabsListRef}
              size={size}
              state={state}
              tooltipProps={item.props.tooltipProps}
              {...(item.key === state.selectedKey ? hoverProps : undefined)}
            />
          ))}
        </TabList>
        <TabPanel key={state.selectedItem?.key} fullHeight={fullHeight} state={state}>
          {panel}
        </TabPanel>
      </StyledTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps };
