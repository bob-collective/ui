import { useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, HTMLAttributes } from 'react';

import { useStyleProps } from '../../hooks';
import { Color, DividerSizes } from '../../theme';
import { MarginProps, Orientation } from '../../theme';
import { ElementTypeProp } from '../utils/types';

import { StyledDivider } from './Divider.style';

type Props = {
  orientation?: Orientation;
  color?: Color;
  size?: DividerSizes;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type DividerProps = Props & NativeAttrs & ElementTypeProp & MarginProps;

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    { elementType: elementTypeProp, orientation = 'horizontal', color = 'grey-300', size = 's', ...props },
    ref
  ): JSX.Element => {
    const elementType = elementTypeProp || orientation === 'vertical' ? 'div' : 'hr';

    const { separatorProps } = useSeparator({
      ...props,
      elementType
    });
    const { styleProps, componentProps } = useStyleProps(props);

    return (
      <StyledDivider
        ref={ref}
        $color={color}
        $orientation={orientation}
        $size={size}
        as={elementType}
        {...mergeProps(separatorProps, styleProps, componentProps)}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };
