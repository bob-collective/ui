'use client';

import { AnimantedAmount, AnimantedAmountProps } from '../AnimantedAmount';
import { BabylonLogo } from '../BabylonLogo';

type BabyPointsProps = Omit<AnimantedAmountProps, 'icon'>;

const BabyPoints = (props: BabyPointsProps) => (
  <AnimantedAmount shouldRoundDown icon={<BabylonLogo style={{ width: '1em', height: '1em' }} />} {...props} />
);

export { BabyPoints };
