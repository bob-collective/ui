import { ChipProps, Flex, useLocale } from '@gobob/ui';
import { PressEvent, usePress } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef, useState } from 'react';

import fireAnimationData from '.././../../../assets/lotties/fire.json';

import { Fire } from './Fire';
import { StyledChip, StyledLottie } from './SpiceChip.style';

type Props = {
  iconPlacement?: 'start' | 'end';
  isLit?: boolean;
  amount: number;
  isDisabled?: boolean;
  onPress?: (e: PressEvent) => void;
};

type InheritAttrs = Omit<ChipProps, keyof Props | 'children'>;

type SpiceChipProps = Props & InheritAttrs;

// TODO: check when voting is possible

const SpiceChip = ({
  iconPlacement = 'start',
  isLit: isLitProp,
  amount,
  isDisabled,
  onPress,
  className,
  ...props
}: SpiceChipProps): JSX.Element => {
  const { locale } = useLocale();
  const [isLit, setLit] = useState(isLitProp);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    setLit(isLitProp);

    if (isLitProp) {
      lottieRef.current?.play();
    }
  }, [isLitProp]);

  const isPressable = !!onPress && !isDisabled;

  const icon = isLit ? (
    <StyledLottie
      animationData={fireAnimationData}
      // TODO: fix
      autoPlay={!isPressable || isLit}
      loop={2}
      lottieRef={lottieRef}
    />
  ) : (
    <Fire isLit={isLit} size='xs' />
  );

  const { pressProps } = usePress({ isDisabled, onPress: isPressable ? onPress : undefined });

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
