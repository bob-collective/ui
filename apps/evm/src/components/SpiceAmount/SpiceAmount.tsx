'use client';

import { Spice } from '@gobob/icons';

import { AnimatedAmount, AnimatedAmountProps } from '../AnimatedAmount';

type SpiceAmountProps = Omit<AnimatedAmountProps, 'icon'>;

const SpiceAmount = (props: SpiceAmountProps) => (
  <AnimatedAmount icon={<Spice style={{ width: '1em', height: '1em' }} />} {...props} />
);

export { SpiceAmount };
