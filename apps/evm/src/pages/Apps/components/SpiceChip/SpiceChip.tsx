import { ChipProps, Flex, useLocale } from '@gobob/ui';
import { chain, mergeProps } from '@react-aria/utils';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { PressEvent, usePress } from '@react-aria/interactions';

import fireAnimationData from '.././../../../assets/lotties/fire.json';

import { Fire } from './Fire';
import { StyledChip, StyledLottie } from './SpiceChip.style';

type Props = {
  iconPlacement?: 'start' | 'end';
  isLit?: boolean;
  amount: number;
  onPress?: (e: PressEvent) => void;
};

type InheritAttrs = Omit<ChipProps, keyof Props | 'children'>;

type SpiceChipProps = Props & InheritAttrs;

const SpiceChip = ({
  iconPlacement = 'start',
  isLit: isLitProp,
  amount,
  onPress,
  className,
  ...props
}: SpiceChipProps): JSX.Element => {
  const { locale } = useLocale();
  const [isLit, setLit] = useState(isLitProp);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const [isAnimationRunning, setAnimationRunning] = useState(false);

  useEffect(() => {
    setLit(isLitProp);
  }, [isLitProp]);

  const handlePress = () => {
    //waits for animation to run and avoid spam from user
    if (isAnimationRunning) return;

    setLit((lit) => !lit);

    if (!isLit) {
      setAnimationRunning(true);
      lottieRef.current?.play();
    }
  };

  const isPressable = !!onPress;

  const icon = isLit ? (
    <StyledLottie
      animationData={fireAnimationData}
      autoPlay={!isPressable || isLit}
      loop={2}
      lottieRef={lottieRef}
      onComplete={() => setAnimationRunning(false)}
    />
  ) : (
    <Fire isLit={isLit} size='xs' />
  );

  const { pressProps } = usePress({ onPress: isPressable ? chain(onPress, handlePress) : undefined });

  return (
    <StyledChip
      {...mergeProps(props, pressProps)}
      $isPressable={isPressable}
      background='grey-900'
      borderColor={isLit ? 'primary-500' : 'grey-700'}
      className={className}
      style={{ padding: 0, flexShrink: 0 }}
    >
      <Flex alignItems='center' elementType='span' gap='xxs' justifyContent='center'>
        {iconPlacement === 'start' && icon}
        <Flex elementType='span' paddingRight='xs'>
          {Intl.NumberFormat(locale, { notation: 'compact' }).format(amount)}
        </Flex>
        {iconPlacement === 'end' && icon}
      </Flex>
    </StyledChip>
  );
};

export { SpiceChip };
