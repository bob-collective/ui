import { Flex, FlexProps, useDOMRef } from '@gobob/ui';
import { useListState } from '@react-stately/list';
import { AriaTagGroupProps, useTagGroup } from '@react-aria/tag';
import { mergeProps } from '@react-aria/utils';

import { CardButton } from './CardButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AriaAttrs = AriaTagGroupProps<any>;

type InheritAttrs = Omit<FlexProps, keyof AriaAttrs | 'children'>;

type HeaderProps = AriaAttrs & InheritAttrs;

const ButtonGroup = ({
  onSelectionChange,
  selectionMode,
  selectedKeys,
  disabledKeys,
  ...props
}: HeaderProps): JSX.Element => {
  const domRef = useDOMRef<HTMLDivElement>(null);
  const state = useListState({ ...props, onSelectionChange, selectionMode, selectedKeys, disabledKeys });
  const { gridProps } = useTagGroup(props, state, domRef);

  return (
    <Flex {...mergeProps(gridProps, props)} ref={domRef}>
      {[...state.collection].map((item) => (
        <CardButton key={item.key} item={item} state={state} />
      ))}
    </Flex>
  );
};

export { ButtonGroup };
