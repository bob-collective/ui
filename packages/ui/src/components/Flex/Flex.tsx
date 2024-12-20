import type { HTMLAttributes } from 'react';

import { forwardRef } from 'react';

import { StyleProps, useStyleProps } from '../../hooks';
import {
  AlignItems,
  AlignSelf,
  Direction,
  JustifyContent,
  MarginProps,
  PaddingProps,
  ResponsiveProp,
  Spacing,
  Wrap
} from '../../theme';
import { ElementTypeProp } from '../utils/types';

import { StyledFlex } from './Flex.style';

type Props = {
  gap?: ResponsiveProp<Spacing>;
  justifyContent?: ResponsiveProp<JustifyContent>;
  alignItems?: ResponsiveProp<AlignItems>;
  direction?: ResponsiveProp<Direction>;
  flex?: ResponsiveProp<string | number>;
  wrap?: ResponsiveProp<Wrap | boolean>;
  alignSelf?: ResponsiveProp<AlignSelf>;
  styleProps?: StyleProps;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type FlexProps = Props & NativeAttrs & ElementTypeProp & MarginProps & PaddingProps;

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      children,
      gap,
      justifyContent,
      alignItems,
      direction,
      flex,
      wrap,
      alignSelf,
      elementType,
      styleProps: stylePropsProp,
      ...props
    },
    ref
  ): JSX.Element => {
    const { styleProps, componentProps } = useStyleProps(props);

    return (
      <StyledFlex
        ref={ref}
        $alignItems={alignItems}
        $alignSelf={alignSelf}
        $direction={direction}
        $flex={flex}
        $gap={gap}
        $justifyContent={justifyContent}
        $wrap={wrap}
        as={elementType}
        {...(stylePropsProp || styleProps)}
        {...componentProps}
      >
        {children}
      </StyledFlex>
    );
  }
);

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps };
