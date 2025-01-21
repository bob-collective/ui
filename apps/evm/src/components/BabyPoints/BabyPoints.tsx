'use client';

import { Babylon } from '@gobob/icons';

import { AnimatedAmount, AnimatedAmountProps } from '../AnimatedAmount';

type BabyPointsProps = Omit<AnimatedAmountProps, 'icon'>;

const BabyPoints = (props: BabyPointsProps) => (
  <AnimatedAmount
    shouldRoundDown
    icon={<Babylon style={{ width: '1em', height: '1em' }} />}
    maximumFractionDigits={2}
    {...props}
  />
);

export { BabyPoints };
