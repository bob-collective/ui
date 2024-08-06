import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { forwardRef, JSXElementConstructor } from 'react';
import { useFocusRing } from '@react-aria/focus';

import { useDOMRef } from '../../hooks';
import { Color, Rounded } from '../../theme';
import { FlexProps } from '../Flex';
import { ElementTypeProp } from '../utils/types';

import { StyledCard } from './Card.style';

type Props = {
  isHoverable?: boolean;
  isPressable?: boolean;
  isDisabled?: boolean;
  background?: Color;
  borderColor?: Color;
  rounded?: Rounded;
  shadowed?: boolean;
  disableAnimation?: boolean;
  onPress?: (e: PressEvent) => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type CardProps = Props & InheritAttrs & ElementTypeProp;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      direction = 'column',
      background,
      isHoverable,
      isPressable,
      children,
      elementType,
      isDisabled,
      rounded = 'xl',
      padding = 'xl',
      shadowed = false,
      borderColor,
      disableAnimation,
      onPress,
      ...props
    },
    ref
  ): JSX.Element => {
    const cardRef = useDOMRef(ref);
    const { buttonProps } = useButton(
      {
        elementType: (elementType as JSXElementConstructor<any>) || 'div',
        isDisabled: !isPressable || isDisabled,
        onPress,
        ...props
      },
      cardRef
    );

    const { isFocusVisible, focusProps } = useFocusRing(props);

    return (
      <StyledCard
        ref={cardRef}
        $background={background}
        $borderColor={borderColor}
        $disableAnimation={disableAnimation}
        $isDisabled={isDisabled}
        $isFocusVisible={isFocusVisible}
        $isHoverable={isHoverable}
        $isPressable={isPressable}
        $rounded={rounded}
        $shadowed={shadowed}
        direction={direction}
        elementType={elementType}
        padding={padding}
        {...mergeProps(props, isPressable ? mergeProps(buttonProps, focusProps) : {})}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };
