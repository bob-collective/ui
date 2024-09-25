import { ChipProps, Flex, Tooltip, useLocale } from '@gobob/ui';
import { PressEvent } from '@react-aria/interactions';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { chain, mergeProps } from '@react-aria/utils';
import { LottieRefCurrentProps } from 'lottie-react';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';

import fireAnimationData from '.././../../../assets/lotties/fire.json';

import { Fire } from './Fire';
import { StyledChip, StyledLottie } from './SpiceChip.style';

type Props = {
  iconPlacement?: 'start' | 'end';
  isLit?: boolean;
  amount: number;
  isDisabled?: boolean;
  onPress?: (e: PressEvent) => void;
  isVotingExceeded?: boolean;
};

type InheritAttrs = Omit<ChipProps, keyof Props | 'children'>;

type SpiceChipProps = Props & InheritAttrs;

const SpiceChip = ({
  iconPlacement = 'start',
  isLit: isLitProp,
  amount,
  isDisabled,
  onPress,
  className,
  isVotingExceeded,
  ...props
}: SpiceChipProps): JSX.Element => {
  const { locale } = useLocale();
  const [isLit, setLit] = useState(isLitProp);
  const [shouldPlayAnimation, setShouldPlayAnimation] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const shouldPlayAnimationRef = useRef<boolean>(false);

  useEffect(() => {
    setLit(isLitProp);

    if (shouldPlayAnimationRef.current && isLitProp) {
      lottieRef.current?.play();
      // shouldPlayAnimationRef.current = false;
    }
  }, [isLitProp]);

  const isPressable = !!onPress && !isDisabled;

  const icon = isLit ? (
    <StyledLottie
      animationData={fireAnimationData}
      autoplay={shouldPlayAnimation}
      loop={2}
      lottieRef={lottieRef}
      onAnimationEnd={() => setShouldPlayAnimation(false)}
    />
  ) : (
    <Fire isLit={isLit} size='xs' />
  );

  const handlePress = () => {
    setShouldPlayAnimation(true);
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const { buttonProps } = useButton(
    { isDisabled, onPress: isPressable ? chain(onPress, handlePress) : undefined, elementType: 'div' },
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <Tooltip
      label={
        isPressable
          ? isLitProp
            ? 'Remove vote'
            : isVotingExceeded
              ? 'Voting limit exceeded'
              : 'Vote'
          : 'To cast your vote, please log in'
      }
    >
      <div
        ref={ref}
        {...mergeProps(buttonProps, focusProps, { onClick: handleClick })}
        style={{ outline: isFocusVisible ? undefined : 'none' }}
      >
        <StyledChip
          {...mergeProps(props)}
          $isPressable={isPressable}
          background='grey-900'
          borderColor={isLit ? 'primary-500' : 'grey-700'}
          className={className}
        >
          <Flex alignItems='center' elementType='span' gap='xxs' justifyContent='center'>
            {iconPlacement === 'start' && icon}
            <Flex elementType='span' paddingRight='xs'>
              {Intl.NumberFormat(locale, { notation: 'compact' }).format(amount)}
            </Flex>
            {iconPlacement === 'end' && icon}
          </Flex>
        </StyledChip>
      </div>
    </Tooltip>
  );
};

export { SpiceChip };
