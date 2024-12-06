import { useTabPanel } from '@react-aria/tabs';
import { TabListState } from '@react-stately/tabs';
import { AriaTabPanelProps } from '@react-types/tabs';
import { HTMLAttributes, useRef } from 'react';

type Props = {
  fullHeight?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = AriaTabPanelProps & { state: TabListState<Record<string, any>> };

type TabPanelProps = Props & InheritAttrs & NativeAttrs;

// @internal
const TabPanel = ({ state, children, fullHeight, ...props }: TabPanelProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} ref={ref} style={{ height: fullHeight ? '100%' : undefined }}>
      {children || state.selectedItem?.props.children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export { TabPanel };
