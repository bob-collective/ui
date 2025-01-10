'use client';

import { Babylon } from '@gobob/icons';

import { AnimantedAmount, AnimantedAmountProps } from '../AnimantedAmount';

type BabyPointsProps = Omit<AnimantedAmountProps, 'icon'>;

const BabyPoints = (props: BabyPointsProps) => (
  <AnimantedAmount shouldRoundDown icon={<Babylon style={{ width: '1em', height: '1em' }} />} {...props} />
);

export { BabyPoints };
