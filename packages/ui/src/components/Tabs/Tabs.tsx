import { useFocusRing } from '@react-aria/focus';
import { useTabList } from '@react-aria/tabs';
import { mergeProps } from '@react-aria/utils';
import { useTabListState } from '@react-stately/tabs';
import { CollectionChildren, Key } from '@react-types/shared';
import { HTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { useFocusWithin, useHover } from '@react-aria/interactions';

import { useDOMRef } from '../../hooks';
import { AlignItems, TabsSize } from '../../theme';

import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { StyledTabs, TabList, TabListWrapper, TabSelection } from './Tabs.style';

type Props = {
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (index: Key) => void;
  disabledKeys?: Key[];
  panel?: React.ReactNode;
  fullWidth?: boolean;
  size?: TabsSize;
  align?: AlignItems;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TabsProps = Props & NativeAttrs;

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { children, className, style, panel, fullWidth = false, size = 'md', align = 'flex-start', ...props },
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
      <StyledTabs className={className} style={style}>
        <TabListWrapper $align={align} $fullWidth={fullWidth} $size={size}>
          <TabSelection
            $isFocusWithin={isFocusWithin}
            $isHovered={isHovered}
            $size={size}
            $transform={activeTabStyle.transform}
            $width={activeTabStyle.width}
          />
          <TabList
            {...mergeProps(tabListProps, focusRingProps, focusWithinProps)}
            ref={tabsListRef}
            $fullWidth={fullWidth}
          >
            {[...state.collection].map((item) => (
              <Tab
                key={item.key}
                fullWidth={fullWidth}
                item={item}
                size={size}
                state={state}
                {...(item.key === state.selectedKey ? hoverProps : undefined)}
              />
            ))}
          </TabList>
        </TabListWrapper>
        <TabPanel key={state.selectedItem?.key} state={state}>
          {panel}
        </TabPanel>
      </StyledTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps };
