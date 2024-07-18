import { Flex, FlexProps, useDOMRef } from '@gobob/ui';
import { useListState } from '@react-stately/list';
import { AriaTagGroupProps, useTagGroup } from '@react-aria/tag';
import { mergeProps } from '@react-aria/utils';

import { CardButton } from './CardButton';

type Props = {};

type AriaAttrs = Omit<AriaTagGroupProps<any>, keyof Props>;

type InheritAttrs = Omit<FlexProps, (keyof Props & AriaAttrs) | 'children'>;

type HeaderProps = Props & AriaAttrs & InheritAttrs;

const ButtonGroup = ({ ...props }: HeaderProps): JSX.Element => {
  const domRef = useDOMRef<HTMLDivElement>(null);
  let state = useListState(props);
  let { gridProps } = useTagGroup(props, state, domRef);

  return (
    <Flex {...mergeProps(gridProps, props)} ref={domRef}>
      {[...state.collection].map((item) => (
        <CardButton key={item.key} item={item} state={state} />
      ))}
    </Flex>
  );
};

export { ButtonGroup };
