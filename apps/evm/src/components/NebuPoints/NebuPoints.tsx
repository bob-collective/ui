'use client';

import { AnimantedAmount, AnimantedAmountProps } from '../AnimantedAmount';
import { BabylonLogo } from '../BabylonLogo';

type NebuPointsProps = Omit<AnimantedAmountProps, 'icon'>;

const NebuPoints = (props: NebuPointsProps) => (
  <AnimantedAmount icon={<BabylonLogo style={{ width: '1em', height: '1em' }} />} {...props} />
);

export { NebuPoints };
