import { ListState } from '@react-stately/list';
import { useTag, AriaTagProps } from '@react-aria/tag';
import { useRef } from 'react';

import { StyledCard } from './CardButton.style';

type Props = { state: ListState<any> };

type InheritAttrs = Omit<AriaTagProps<any>, keyof Props>;

type CardButtonProps = Props & InheritAttrs;

const CardButton = ({ ...props }: CardButtonProps): JSX.Element => {
  let { item, state } = props;
  let ref = useRef(null);
  let { rowProps, gridCellProps } = useTag(props, state, ref);

  return (
    <StyledCard
      ref={ref}
      isHoverable
      isPressable
      alignItems='center'
      flex={1}
      justifyContent='center'
      padding='md'
      {...rowProps}
    >
      <div {...gridCellProps}>{item.rendered}</div>
    </StyledCard>
  );
};

export { CardButton };