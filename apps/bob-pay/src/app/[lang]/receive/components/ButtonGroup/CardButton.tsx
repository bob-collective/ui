import { ListState } from '@react-stately/list';
import { useTag, AriaTagProps } from '@react-aria/tag';
import { useRef } from 'react';

import { StyledCard } from './CardButton.style';

type Props = { state: ListState<any> };

type InheritAttrs = Omit<AriaTagProps<any>, keyof Props>;

type CardButtonProps = Props & InheritAttrs;

const CardButton = ({ ...props }: CardButtonProps): JSX.Element => {
  const { item, state } = props;
  const ref = useRef(null);
  const { rowProps, gridCellProps } = useTag(props, state, ref);

  return (
    <StyledCard
      ref={ref}
      isHoverable
      isPressable
      alignItems='center'
      background='grey-500'
      bordered={'transparent' as any}
      flex={1}
      isDisabled={!!rowProps['aria-disabled']}
      justifyContent='center'
      padding='md'
      {...rowProps}
    >
      <div {...gridCellProps}>{item.rendered}</div>
    </StyledCard>
  );
};

export { CardButton };
